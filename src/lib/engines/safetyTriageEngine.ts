import { ClinicalScreeningData, RiskLevel } from '@/types';

export interface SafetyTriageResult {
  riskLevel: RiskLevel;
  canProceedWithAutomaticPlan: boolean;
  redFlagsDetected: string[];
  precautions: string[];
  medicalReferralMessage?: string;
}

export function evaluateClinicalSafety(clinical: ClinicalScreeningData): SafetyTriageResult {
  const redFlags: string[] = [];
  const precautions: string[] = [];

  // Banderas Rojas Absolutas (PAR-Q+ & Criterios Clínicos de Emergencia)
  if (clinical.hasChestPainAtRestOrExercise) {
    redFlags.push('Dolor u opresión torácica durante el reposo o la actividad física (Criterio cardiovascular de alto riesgo).');
  }

  if (clinical.hasSyncopeOrDizziness) {
    redFlags.push('Episodios de síncope (desmayos) o mareo con pérdida de equilibrio al realizar esfuerzo físico.');
  }

  if (clinical.hasUncontrolledHypertension) {
    redFlags.push('Hipertensión arterial diagnosticada no controlada clínicamente.');
  }

  if (clinical.hasKnownHeartMurmurOrDisease) {
    redFlags.push('Cardiopatía congénita, soplo orgánico o arritmia sintomática no evaluada recientemente por cardiología.');
  }

  if (clinical.hasSevereEatingDisorderHistory) {
    redFlags.push('Antecedente activo o reciente de trastorno de la conducta alimentaria (TCA) que contraindica la prescripción de déficits o conteo calórico no supervisado.');
  }

  // Precauciones Relativas / Musculoesqueléticas
  if (clinical.hasJointPainDuringExercise && clinical.jointPainLocations.length > 0) {
    precautions.push(
      `Presencia de dolor articular en: ${clinical.jointPainLocations.join(', ')}. Se activará filtro biomecánico restrictivo en la selección de ejercicios.`
    );
  }

  if (clinical.diagnosedDiseases.length > 0) {
    precautions.push(`Condiciones preexistentes registradas: ${clinical.diagnosedDiseases.join(', ')}.`);
  }

  if (clinical.isPregnantOrLactating) {
    precautions.push('Estado de embarazo o lactancia: requiere autorización médica gineco-obstétrica para prescripción deportiva.');
  }

  const isHighRisk = redFlags.length > 0;
  const isModerateRisk = !isHighRisk && (precautions.length > 0 || clinical.medicalClearanceRequired);

  let riskLevel: RiskLevel = 'low';
  if (isHighRisk) riskLevel = 'high_clinical_stop';
  else if (isModerateRisk) riskLevel = 'moderate';

  return {
    riskLevel,
    canProceedWithAutomaticPlan: !isHighRisk,
    redFlagsDetected: redFlags,
    precautions,
    medicalReferralMessage: isHighRisk
      ? 'POR TU SEGURIDAD: Hemos detectado indicadores clínicos de alarma. Siguiendo los estándares del ACSM y la medicina del deporte, la prescripción automática ha sido suspendida. Es indispensable presentar un certificado de aptitud física expedido por tu médico o cardiólogo antes de iniciar cualquier programa.'
      : undefined
  };
}
