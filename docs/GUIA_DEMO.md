# Guia de Demo — PINSA Torre de Control de Planeacion

**Para:** Presentadores del demo (FerDi y equipo)
**Audiencia objetivo:** Equipo directivo y de planeacion de PINSA
**Duracion estimada:** 25-35 minutos (recorrido completo)
**Requisito:** Tener el demo abierto en el navegador antes de iniciar

---

## Antes de empezar

- [ ] Abrir el demo en el navegador (URL de Railway o `http://localhost:3001`)
- [ ] Tener el demo en pantalla completa o modo presentacion
- [ ] Verificar que las graficas cargan correctamente (deben verse de inmediato)
- [ ] Tener listo el contexto: "Esto es como se veria la herramienta con sus datos reales"

---

## Seccion 1 — Home: La pantalla de inicio

**Tiempo estimado: 3 minutos**

Al entrar al demo, la pantalla muestra la pagina de inicio con el mensaje central y los 4 accesos por rol.

### Pasos

1. Senalar el encabezado: *"Orquesta tu cadena de valor completa"*
2. Mostrar la franja de KPIs en la parte inferior:
   - Fill Rate: 91.3% (debajo de meta)
   - Asertividad: 87.4%
   - Capital de trabajo: $301M MXN
   - Dias de cobertura: 47 dias
3. Explicar los 4 accesos por rol:

| Tarjeta | Rol PINSA |
|---|---|
| **Directivo** | Director General, Direccion Comercial |
| **Planeador de Demanda** | Equipo de demand planning |
| **Ventas / Colaboracion** | Gerentes de canal, KAMs |
| **Planeador de Inventarios** | Supply chain, logistica |

4. Hacer clic en **"Directivo"** para entrar al Dashboard

### Lista de verificacion
- [ ] Los 4 KPIs son visibles en la franja inferior
- [ ] Las 4 tarjetas de rol son visibles
- [ ] El clic en "Directivo" navega al Dashboard sin retraso

---

## Seccion 2 — Dashboard Directivo

**Tiempo estimado: 8 minutos**

El Dashboard es la vista de control diario del director. Muestra el estado actual del negocio en una sola pantalla.

### Pasos

1. Senalar los **4 KPI cards** en la parte superior:
   - Fill Rate OTIF: 91.3% — en alerta (meta: 95%)
   - Asertividad Pronostico: 87.4% — por mejorar
   - Cobertura Inventario: 47 dias — en meta
   - Capital de Trabajo: $301M MXN — en alerta

2. Mostrar las **Alertas activas** (lado derecho):
   - Hay 3 alertas: 2 de alta severidad, 1 media
   - Ejemplo: "DOL-POUCH-ACE fill rate 79% — 3 semanas consecutivas debajo de meta"
   - Punto clave: *"No tienes que buscar los problemas — el sistema te los trae"*

3. Mostrar la **grafica de Fill Rate** (12 meses de historial):
   - La linea roja punteada es la meta del 95%
   - Los ultimos 3 meses muestran caida — alineado con las alertas

4. Mostrar **Ventas vs COGS** (barras agrupadas):
   - Azul = ventas reales, marron = COGS
   - Punto clave: *"Ves de un vistazo si el margen se esta comprimiendo"*

5. Mostrar **Mix de ventas por canal** (parte inferior izquierda):
   - Autoservicio 45%, Mayoreo 28%, Foodservice 18%, Exportacion 9%

6. Mostrar **Top SKUs por volumen** (tabla inferior derecha):
   - Dolores Atun Agua 170g lidera con 48,200 cajas/mes

### Lista de verificacion
- [ ] Los 4 KPI cards muestran valor, meta y badge de estatus
- [ ] Al menos 1 alerta de Alta severidad es visible
- [ ] Las 3 graficas renderizan correctamente (Fill Rate, Ventas vs COGS, Capital de Trabajo)
- [ ] La tabla de Top SKUs muestra al menos 5 productos

---

## Seccion 3 — Ciclo S&OP: Flujo completo de 5 pasos

**Tiempo estimado: 12 minutos**

Esta es la parte central del demo. Muestra el flujo completo del ciclo S&OP mensual — el proceso que normalmente tarda semanas y requiere decenas de correos y archivos de Excel, ahora en un flujo digital guiado.

Hacer clic en **"Ciclo S&OP"** en la barra lateral izquierda.

---

### Paso 1 — Pronostico estadistico

**Tiempo: 2 minutos**

1. Mostrar los **3 KPI cards** de accuracy:
   - Asertividad Feb 2025: 87.4%
   - Mejora con colaboracion: +3.2 puntos
   - Sesgo del pronostico: -2.1% (tendencia a sub-pronosticar)

2. Mostrar la **grafica de barras** (6 meses de historial):
   - 3 series: estadistico, colaborado, real
   - Punto clave: *"El colaborado siempre se acerca mas al real — eso justifica el proceso"*

3. Mostrar la **tabla de accuracy por SKU**:
   - Cada SKU tiene su propio porcentaje de asertividad
   - Los que estan en rojo son los que mas necesitan atencion

4. Hacer clic en **"Confirmar y continuar"**

---

### Paso 2 — Colaboracion de ventas

**Tiempo: 3 minutos**

1. Explicar el contexto: *"Aqui el equipo de ventas puede ajustar el pronostico estadistico con su conocimiento del mercado — sin necesidad de mandar un correo o actualizar un Excel compartido"*

2. Mostrar la **tabla de ajustes por SKU**:
   - Cada fila tiene: pronostico estadistico, ajuste propuesto, porcentaje de cambio
   - Los ajustes se pueden editar directamente en la tabla

3. Hacer clic en una celda de ajuste para mostrar que es **editable en tiempo real**

4. Mostrar que al cambiar un valor, el campo de **justificacion** se activa automaticamente

5. Hacer clic en **"Confirmar y continuar"**

---

### Paso 3 — Revision de calidad

**Tiempo: 2 minutos**

1. Mostrar el **radar de score de calidad**:
   - 6 dimensiones: Asertividad, Colaboracion, Sesgo, Cobertura, Fill Rate, Ciclo
   - Area azul = actual, area gris = meta
   - Punto clave: *"De un vistazo ves en que dimension del proceso S&OP estan bien y en cual hay que trabajar"*

2. Mostrar el **comparativo MAPE por canal**:
   - Autoservicio tiene mejor accuracy que Mayoreo
   - Foodservice es el canal con mayor variabilidad

3. Hacer clic en **"Confirmar y continuar"**

---

### Paso 4 — Plan de inventarios

**Tiempo: 2 minutos**

1. Mostrar la **grafica de dias de cobertura por SKU**:
   - Linea roja = minimo operativo (20 dias)
   - Linea amarilla = stock de seguridad (35 dias)
   - Las barras rojas son SKUs en zona critica

2. Mostrar la **tabla de plan de reposicion**:
   - Ordenes sugeridas con cantidad, proveedor y fecha de entrega esperada
   - Los SKUs criticos (DOL-POUCH, GUA-170) estan marcados en rojo

3. Hacer clic en **"Confirmar y continuar"**

---

### Paso 5 — Validacion financiera

**Tiempo: 3 minutos**

1. Mostrar el **P&L proyectado vs presupuesto**:

| Metrica | Real | Presupuesto | Variacion |
|---|---|---|---|
| Ventas netas | $148M | $141.5M | +4.6% |
| COGS | $97.2M | $90.8M | +7.1% |
| Margen bruto | 34.3% | 35.8% | -1.5 pp |
| Capital de trabajo | $301.2M | $290M | +3.9% |

2. Mostrar los **riesgos financieros identificados**:
   - COGS +7.1% por alza en atun y hojalata (Alta)
   - Riesgo de perdida de ventas por desabasto (Alta)
   - Capital de trabajo $11.2M sobre plan (Media)
   - Revenue +$6.5M por mejor temporada Semana Santa (Baja — positivo)

3. Mostrar el **boton de aprobacion**:
   - Hacer clic en **"Aprobar plan Abr 2026"** (botón al final del stepper)
   - El ciclo se marca como completado

### Lista de verificacion
- [ ] El stepper muestra los 5 pasos con el paso actual resaltado
- [ ] Se puede navegar hacia adelante con "Confirmar y continuar"
- [ ] Se puede regresar con "Paso anterior"
- [ ] El paso 5 muestra el P&L con variaciones vs presupuesto
- [ ] El boton de aprobacion cambia el estado de la pantalla

---

## Seccion 4 — Simulador de Escenarios

**Tiempo estimado: 7 minutos**

El Simulador permite responder preguntas del tipo: *"Que pasaria si el precio del atun sube 20%?"* o *"Que impacto tiene un desabasto de 6 semanas en nuestro fill rate y capital de trabajo?"*

Hacer clic en **"Simulador"** en la barra lateral izquierda.

### Pasos

1. Explicar la pantalla: hay 4 sliders (controles deslizantes) y un selector de horizonte de tiempo

| Control | Que simula | Valor default |
|---|---|---|
| Precio materia prima | Alza o baja en el costo de insumos | 0% |
| Desabasto de MP | Porcentaje de faltante en suministro | 0% |
| Variacion de demanda | Alza o baja inesperada en ventas | 0% |
| Stock de seguridad | Dias de inventario de seguridad | 33 dias |

2. **Escenario 1 — Alza en materias primas:**
   - Mover el slider de "Precio materia prima" a +15%
   - Mostrar como cambia el "Impacto del escenario":
     - Fill Rate promedio baja
     - Δ COGS materiales sube
   - Mostrar que las graficas se actualizan en tiempo real

3. **Escenario 2 — Desabasto severo:**
   - Mover "Desabasto de MP" a 40%
   - Mostrar el impacto en Fill Rate proyectado (grafica izquierda)
   - Mostrar el impacto en Capital de Trabajo (grafica derecha)

4. **Escenario 3 — Zona de riesgo extremo (demostrar el warning):**
   - Mover "Desabasto de MP" a 65%
   - Mover "Variacion de demanda" a 35%
   - Mostrar el **banner de advertencia rojo**: "Valor fuera de rangos aceptables"
   - Punto clave: *"El sistema te avisa cuando estas en territorio de crisis, no solo de planificacion normal"*

5. Mostrar la **interpretacion narrativa** que aparece debajo de los sliders cuando hay cambios:
   - Texto en lenguaje natural que explica el impacto del escenario

6. Hacer clic en **"Reset"** para volver a los valores default

7. Mostrar el **selector de horizonte**: cambiar de "3 meses" a "12 meses" y mostrar como las graficas se extienden

### Lista de verificacion
- [ ] Los 4 sliders responden de inmediato al moverlos
- [ ] Las graficas se actualizan en tiempo real (sin recargar la pagina)
- [ ] El banner de advertencia aparece con desabasto > 60% Y demanda > 30%
- [ ] El boton "Reset" regresa todos los valores al default
- [ ] El selector de horizonte cambia el rango de las graficas

---

## Cierre del demo

**Tiempo estimado: 3 minutos**

Despues de mostrar el Simulador, regresar al Home para el cierre:

1. *"Lo que vieron hoy es una muestra de como podria verse la plataforma con los datos reales de PINSA"*
2. *"El siguiente paso seria conectar esto con su ERP para tener los datos en tiempo real, agregar autenticacion por rol, y agregar las capacidades de exportacion que necesitan"*
3. Preguntas y respuestas

---

## Preguntas frecuentes

**P: Los datos son reales?**
R: No. Son datos ficticios pero construidos para reflejar la escala y los productos reales de PINSA (atun Dolores, Guardamar, La Sirena). En produccion se conectaria al ERP.

**P: Cuanto tiempo toma implementarlo con datos reales?**
R: La arquitectura ya esta lista para conectar a una base de datos. Lo que esta construido es el 80% del trabajo — agregar datos reales es el 20% restante.

**P: Puede funcionar en celular?**
R: El demo esta optimizado para pantallas de escritorio (presentaciones, reuniones). Una version movil es posible en V1.

**P: Cuantos usuarios pueden acceder simultaneamente?**
R: En V0 no hay limite porque no hay base de datos. En V1 con Railway, cientos de usuarios concurrentes sin problema.

**P: Se puede exportar el plan a Excel o PDF?**
R: Todavia no. Esta en el roadmap de V1.
