# MOTIVE LAB — Sistema Integral de Fisiología, Nutrición SMAE y Entrenamiento Deportivo

Plataforma profesional multidisciplinaria diseñada y construida desde sus fundamentos para brindar prescripción deportiva, nutricional y clínica basada en evidencia matemática y científica comprobable.

---

## 1. Equipo Multidisciplinario y Fundamentos

MOTIVE LAB ha sido concebido por un equipo de especialistas:
- **Arquitecto de Software & Desarrollador Full-Stack Senior:** Arquitectura modular Next.js 14, TypeScript estricto, Tailwind CSS, PostgreSQL / Supabase con Row Level Security (RLS).
- **Diseñador UX/UI Especializado en Deporte:** Estética deportiva premium (fondo oscuro obsidiana `#0A0A0C`, acento rojo deportivo vibrante `#DC2626`, contraste WCAG AAA, interfaces de alta inmersión sin sensación de hoja de cálculo).
- **Nutriólogo Clínico Deportivo:** Implementación del Sistema Mexicano de Alimentos Equivalentes (SMAE 5.ª Edición), motor de sustitución por grupos con tolerancias nutricionales estrictas (±5% calorías, ±3g proteína) y conversión de rendimientos crudo vs cocido.
- **Especialista en Fisiología del Ejercicio e Hipertrofia:** Ecuaciones validadas (Mifflin-St Jeor, Katch-McArdle, TDEE sin doble conteo de actividad) y recomendaciones ISSN / ACSM 2026.
- **Entrenador Certificado (CSCS):** Motor de periodización (Full Body, Torso/Pierna, PPL), diferenciación obligatoria de series de aproximación vs series efectivas y autorregulación por RIR (*Reps In Reserve*).
- **Especialista en Medicina del Deporte y Prevención de Lesiones:** Triaje clínico PAR-Q+ con suspensión inmediata de prescripción algorítmica ante dolor torácico, síncope o banderas rojas.
- **Experto en Ciberseguridad y Protección de Datos:** Aislamiento estricto de expedientes, consentimiento explícito separado para datos sensibles de salud conforme a la legislación mexicana (LFPDPPP) y mecanismos ARCO.

---

## 2. Estructura del Proyecto

```
proyecto app/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout con providers y dark mode
│   │   ├── globals.css           # Estilos base y scrollbar deportivo
│   │   ├── page.tsx              # Pantalla inicial institucional y registro
│   │   ├── evaluacion/           # Cuestionario integral multipaso (PAR-Q+, antropometría, etc.)
│   │   ├── dashboard/            # Panel personal del cliente con KPIs y sesión del día
│   │   ├── nutricion/            # Plan semanal SMAE, sustitución de alimentos y compras
│   │   ├── entrenamiento/        # Biblioteca biomecánica y logger de sobrecarga progresiva
│   │   ├── recuperacion/         # Hidratación adaptativa y dossiers de suplementos ISSN
│   │   ├── reportes/             # Reporte clínico digital e imprimible en PDF
│   │   └── coach/                # Portal de supervisión para Coaches y Nutriólogos
│   ├── components/
│   │   └── layout/               # Navbar con selector de rol y Footer institucional
│   ├── lib/
│   │   ├── data/                 # Bases de datos SMAE México, ejercicios y suplementos
│   │   │   ├── smaeFoods.ts
│   │   │   ├── exerciseDatabase.ts
│   │   │   └── supplementEvidence.ts
│   │   ├── engines/              # Motores matemáticos deterministas
│   │   │   ├── metabolicEngine.ts
│   │   │   ├── safetyTriageEngine.ts
│   │   │   ├── nutritionEngine.ts
│   │   │   ├── substitutionEngine.ts
│   │   │   ├── trainingEngine.ts
│   │   │   ├── progressionEngine.ts
│   │   │   └── hydrationEngine.ts
│   │   ├── store/                # Estado reactivo global y modo offline/demo
│   │   └── supabase/             # Cliente Supabase y script DDL de migraciones
│   └── types/                    # Definiciones TypeScript de grado clínico
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

---

## 3. Instalación y Ejecución Local

### Prerrequisitos:
- **Node.js:** v18.0.0 o superior (recomendado Node 20+ LTS).
- **NPM:** v9.0.0 o superior.

### Pasos:
1. Clonar o abrir la carpeta del proyecto:
   ```bash
   cd "c:\Users\jony1\Downloads\proyecto app"
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

---

## 4. Pruebas y Criterios de Aceptación Verificados

1. **Aislamiento y Roles:** Puedes cambiar el rol en tiempo real desde el selector en el Navbar (`Cliente`, `Coach`, `Nutriólogo`, `Admin`) para probar los permisos de cada perspectiva.
2. **Evaluación Integral Multipaso:** El formulario en `/evaluacion` almacena los datos, valida consistencia y activa el motor PAR-Q+ con detección de banderas rojas.
3. **Cálculos Metabólicos Reproducibles:** Toda prescripción muestra la fórmula (Mifflin o Katch), parámetros y desglose de gramos por kg.
4. **Alimentos SMAE y Sustituciones:** En `/nutricion` puedes sustituir cualquier alimento y verificar el recalculo automático en gramos para preservar las calorías y proteínas.
5. **Doble Progresión y Series Efectivas:** En `/entrenamiento` puedes registrar repeticiones y RIR; al completar el rango superior se activa la recomendación de aumento de carga micro-progresiva (+1.25 / +2.5 kg).
6. **Reportes Clínicos PDF:** En `/reportes` puedes presionar "Imprimir o Exportar PDF" para obtener un informe listo para expediente físico o digital.
