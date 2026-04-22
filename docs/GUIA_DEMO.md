# Guía de Demo — PINSA Torre de Control de Planeación

> **Versión:** 0.5.0 · **Ciclo demo:** Abril 2026 · **Duración:** 30–40 min

Esta guía orienta la presentación del demo a equipos directivos/operativos de PINSA. El recorrido está alineado con la propuesta de diseño full de Arena Analytics (Propuesta-diseno-full-Pinsa.md).

---

## Antes de empezar

- [ ] Abrir `http://localhost:3001` (o URL Railway) en pantalla completa
- [ ] Tener lista la narrativa: *"Esto es cómo se vería la herramienta con sus datos reales en producción, conectada a SAP."*
- [ ] Considerar audiencia: **ejecutivos** → enfatizar Sesión Ejecutiva + Dashboard. **Planeación operativa** → enfatizar S&OP 5 pasos + Simulador.

---

## 1. Home — Role selector (3 min)

Pantalla de entrada con 4 roles + KPIs reales del negocio.

**Qué mostrar:**
1. Headline: *"Orquesta tu cadena de valor completa"*
2. Franja inferior con 4 KPIs: Fill Rate 91.4% · Asertividad 71.2% · Capital $298M · Cobertura 33d
3. Las 4 tarjetas por rol:
   - **Director de Operaciones** → Sesión Ejecutiva (decisión mensual)
   - **Directivo — Cadena** → Dashboard continuo
   - **Planeador de Demanda** → Ciclo S&OP 5 pasos
   - **Planeador de Inventarios** → Simulador de escenarios

**Punto clave:** *"Cada rol tiene su puerta de entrada, pero todos operan sobre una sola fuente de verdad."*

---

## 2. Sesión Ejecutiva S&OP (10 min) — 🆕 v0.5

**Tiempo estimado: 10 minutos · Es el módulo más potente para audiencia ejecutiva.**

> Propósito: 60 min al mes para **decidir, no reportar**. Los 5 eslabones convergen aquí.

**Qué mostrar:**

1. **Los 4 KPIs que importan**:
   - Fill Rate 91.4% (3.6pp bajo meta)
   - Forecast Accuracy 71.2%
   - Días Inventario 33d (en rango)
   - Brechas Abiertas: 3

2. **Drill-down de 1 clic** — hacer clic en "Fill Rate":
   - Se expande el panel mostrando causa raíz:
     - POR-POUCH-ACE al 87% (brecha L5)
     - MAZ-170-ACE al 89% (hojalata)
   - Acción sugerida concreta.

3. **Brecha que requiere decisión**:
   - L5 (Pouch Portola) con demanda 112K vs capacidad 95K → déficit 17K cajas
   - 3 opciones con impacto $ calculado:
     - A) Ampliar turno: **+$1.85M OPEX**, fill rate intacto
     - B) Quiebre controlado: **−$3.4M ventas**, riesgo deslistado OXXO
     - C) Renegociar Walmart: **−$4.8M revenue**, cero OPEX
   - Hacer clic en "Elegir esta opción" para demostrar el registro de decisión.

4. **P&L proyectado** del ciclo:
   - 4 indicadores vs presupuesto (Ventas +4.6%, COGS +7.1%, Margen −1.5pp, Capital +3.9%)
   - 4 riesgos identificados con severidad

5. **Aprobar plan Abr 2026** al final.

**Punto clave:** *"El sistema presenta opciones con datos — el Director de Operaciones arbitra. No se reporta, se decide."*

---

## 3. Dashboard Directivo (5 min)

Vista de **monitoreo continuo** — complementaria a la Sesión Ejecutiva mensual.

**Qué mostrar:**

1. **4 KPI cards** con meta, tendencia y estatus.
2. **Alertas activas** (4 alertas: 2 altas, 2 medias).
3. **Fill Rate 12 meses** — línea con meta 95%.
4. **Ventas vs COGS** — barras, detectar compresión de margen.
5. **Capital de trabajo** — 12 meses + proyección.
6. **Mix de ventas por canal** con cuentas nombradas:
   - Autoservicios (Walmart · Chedraui · Soriana) 38%
   - Mayoristas (Zorro · 3B · Merza) 22%
   - Conveniencia (OXXO · 7-Eleven) 14%
   - Clubes de Precio (Sam's · Costco) 12%
7. **Top SKUs por volumen** del mes.

**Punto clave:** *"El Dashboard es para el día a día. La Sesión Ejecutiva es para decidir cada mes."*

---

## 4. Ciclo S&OP — 5 pasos (10 min)

Flujo operativo mensual alineado con la propuesta de Arena Analytics.

### Paso 1 — Pronóstico estadístico

1. 3 KPIs de asertividad (71.2%, +3.1pp mejora, −2.4% sesgo)
2. **Intervalo de confianza** (banda sombreada alrededor del forecast):
   - *"El rango — no el número — define tu stock de seguridad"*
3. Chips de eventos calendáricos: Buen Fin, Navidad, Cuaresma · Semana Santa
4. Asertividad por SKU (top 5)

### Paso 2 — Colaboración Comercial

1. **FVA histórico** por categoría (6 últimos ciclos):
   - Promoción +8.2%, Estacionalidad +6.1%, Lanzamiento +4.1%, Anaquel +2.5%, **Competencia −3.8%**
2. Tabla editable con cuentas nombradas (Walmart, Sam's, OXXO, etc.)
3. Categoría obligatoria al editar — badge verde/rojo según FVA histórico
4. **Insight:** ajustes de "acción competencia" empeoran baseline → sobre-reacción

### Paso 3 — Planeación de Inventarios

1. **Red visual Planta Mazatlán → CEDIS México** (2 nodos)
2. **Toggle de vista**: Consolidado · Planta · CEDIS (cambia KPIs)
3. **Política ABC diferenciada** en 3 tarjetas:
   - A: stock seguridad dinámico, reabasto semanal
   - B: estándar, quincenal
   - C: racionalización, bajo demanda
4. Tabla por SKU con desglose planta/CEDIS + badge ABC
5. **Señales de reabasto automáticas** Planta → CEDIS con cajas calculadas

### Paso 4 — Planeación de Producción

1. 3 KPIs: utilización global 85%, líneas con brecha (1), total 14 líneas
2. **Bar chart** capacidad vs demanda por línea
3. Tabla detalle con lote mínimo, setup hours, estado
4. **Brecha L5 Pouch 80g** detectada con 3 opciones modeladas (las mismas que aparecen en Sesión Ejecutiva)
5. Botón "Escalar a Sesión Ejecutiva" por opción

### Paso 5 — Planeación de Distribución

1. Plan de reposición **Planta → CEDIS** por SKU
2. KPIs: cajas a enviar, SKUs en urgencia, nodos de red
3. Tabla con cobertura CEDIS vs target por SKU

**Punto clave:** *"Cada paso tiene dueño, input y output. La Sesión Ejecutiva es donde todos convergen."*

---

## 5. Simulador de escenarios (8 min)

**Tiempo estimado: 8 minutos · Demuestra la capacidad de "what-if".**

**Qué mostrar:**

1. **4 variables**: Precio MP · Desabasto MP · Demanda · Stock de seguridad
2. **5 métricas de impacto** (incluye la nueva eficiencia de producción):
   - Fill Rate promedio
   - Capital de trabajo
   - Eficiencia producción (4º eje de la propuesta)
   - Revenue en riesgo
   - Δ COGS materiales
3. **Gráficas reactivas**: Fill Rate y Capital de trabajo vs baseline
4. **Escenario extremo** — mover desabasto a 70% + demanda a +35% → aparece banner rojo.

### Guardar y comparar escenarios 🆕 v0.5

5. **Guardar un escenario** con nombre (ej. "Alza 20% atún · demanda +15% Semana Santa")
6. Mostrar el **panel de escenarios guardados** con resumen de parámetros y métricas
7. **Marcar con ícono de martillo** → el escenario viaja a la Sesión Ejecutiva
8. Seleccionar 2 escenarios y **comparar lado a lado** en modal

**Punto clave:** *"Los what-if se guardan y se llevan a la sesión ejecutiva. No es una herramienta aislada — alimenta la decisión mensual."*

---

## Preguntas frecuentes

**R: ¿Los datos son reales?**
No — son ficticios pero construidos para reflejar la escala real de PINSA (marcas Dolores · Mazatún · El Dorado · Portola, cuentas Walmart · Sam's · OXXO · Zorro, planta Mazatlán con 14 líneas, 2M cajas/año). En producción se conectaría al ERP SAP (módulos SD · MM · PP · LE/TM).

**R: ¿Por qué no hay escritura al ERP?**
La v1 es solo lectura. Escribir de vuelta al SAP agrega complejidad de gobierno de datos que no vale la pena en la fase inicial. Se agrega en v2 una vez que el proceso esté estable.

**R: ¿Cuánto tarda implementar esto en producción?**
Proyecto típico de 4 fases: Deep Dive → Solutioning → MVP + Piloto → Fine Tuning & Deploy. MVP usable en ~12 semanas con datos reales.

**R: ¿Y la IA?**
La v1 usa forecast estadístico calibrado (Prophet + statsmodels). La IA generativa no mejora forecast cuando los datos son limpios. Llega en v2.

---

## Cierre del demo

1. Regresar al Home
2. Recordar los 4 roles y cómo se conectan mediante la Sesión Ejecutiva
3. Mostrar el stack mencionado en el pitch: Next.js · Python · PostgreSQL · React · AWS/GCP
4. Invitar a siguiente paso: Deep Dive técnico para PINSA con un workshop de 1 día.

**Línea final:** *"El objetivo de la herramienta no es tener el mejor dashboard — es que la sesión ejecutiva mensual dure 60 minutos y termine con decisiones."*
