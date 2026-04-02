# Guia de Pruebas — PINSA Torre de Control de Planeacion

## Que es este documento

Esta es una guia paso a paso para recorrer la Torre de Control de Planeacion de PINSA. Esta disenada para personas de negocio — no necesitas conocimientos tecnicos para seguirla.

**Para quien es:** Cualquier persona del equipo de PINSA que quiera explorar la plataforma y verificar que funciona correctamente.

**Cuanto tiempo toma:** Aproximadamente 40 minutos si haces todas las pruebas. Puedes hacerlas en orden o elegir las que te interesen.

**Que vas a probar:** La plataforma tiene cuatro modulos:
- **Home** — selector de rol y KPIs actuales
- **Dashboard Directivo** — vision ejecutiva del negocio
- **Ciclo S&OP Mensual** — flujo de planeacion de 5 pasos
- **Simulador de Escenarios** — proyecciones interactivas en tiempo real

---

## Antes de empezar

### Navegador
Usa **Google Chrome** o **Microsoft Edge** en su version mas reciente. El demo no esta optimizado para celular — usa una laptop o computadora de escritorio.

### Preparacion
1. Abre este documento en una ventana o pestana del navegador.
2. Abre el demo en otra ventana o pestana (URL abajo).
3. Si vas a tomar notas, ten a la mano el archivo `docs/UAT_DATOS_DEMO.md` con los datos de referencia.

### URL del demo

| Modulo | URL |
|--------|-----|
| Home | `<URL Railway>/` |
| Dashboard | `<URL Railway>/dashboard` |
| Ciclo S&OP | `<URL Railway>/sop` |
| Simulador | `<URL Railway>/simulator` |

> Nota: pedir URL actualizada a FerDi. En local usar `http://localhost:3001`.

### No hay login
El demo V0 no requiere usuario ni contrasena. Solo abre la URL y empieza.

### Como reportar problemas
Anotar: pantalla donde ocurrio, pasos que seguiste, que esperabas que pasara, que paso en realidad. Captura de pantalla si es posible.

---

## Prueba 1: Cargar la pantalla de inicio (~3 min)

**Objetivo:** Verificar que el demo carga correctamente y muestra la pantalla principal.

**Pasos:**

1. Abre el demo en el navegador (URL del Home).
2. Espera a que la pagina cargue completamente (menos de 3 segundos).
3. Verifica que ves el encabezado central de la pagina.
4. Verifica que hay una franja con numeros en la parte inferior.
5. Verifica que hay 4 tarjetas de acceso por rol.

**Resultado esperado:**

- [ ] El titulo "Orquesta tu cadena de valor completa" es visible
- [ ] La franja inferior muestra 4 metricas: Fill Rate, Asertividad, Capital de trabajo, Dias de cobertura
- [ ] Las 4 tarjetas de rol son visibles: Directivo, Planeador de Demanda, Ventas / Colaboracion, Planeador de Inventarios
- [ ] La pagina no muestra errores ni pantallas en blanco

**Tiempo real:** _____ min

---

## Prueba 2: Navegar al Dashboard Directivo (~5 min)

**Objetivo:** Verificar que el Dashboard carga con KPIs, alertas y graficas correctamente.

**Pasos:**

1. Desde el Home, haz clic en la tarjeta **"Directivo"**.
2. Verifica que la URL cambia a `/dashboard`.
3. Espera 1-2 segundos a que los KPI cards aparezcan completamente.
4. Revisa los 4 KPI cards en la parte superior.
5. Revisa la seccion de alertas activas (lado derecho).
6. Revisa las 3 graficas de tendencia.
7. Revisa la tabla de Top SKUs en la parte inferior.

**Resultado esperado:**

- [ ] La URL cambia a `/dashboard` sin errores
- [ ] 4 KPI cards son visibles: Fill Rate OTIF (91.3%), Asertividad Pronostico (87.4%), Cobertura Inventario (47 dias), Capital de Trabajo ($301M)
- [ ] Cada KPI card muestra un badge de estatus (En meta / Por mejorar / Alerta)
- [ ] La seccion "Alertas activas" muestra al menos 1 alerta con severidad Alta
- [ ] Las 3 graficas renderizan: Fill Rate 12 meses, Ventas vs COGS, Capital de Trabajo
- [ ] La tabla muestra al menos 5 SKUs con "Dolores Atun Agua 170g" en primer lugar
- [ ] La barra lateral izquierda muestra los 3 links de navegacion

**Tiempo real:** _____ min

---

## Prueba 3: Iniciar el ciclo S&OP — Paso 1 Pronostico (~5 min)

**Objetivo:** Verificar que el flujo S&OP carga correctamente y el Paso 1 muestra el pronostico estadistico.

**Pasos:**

1. Haz clic en **"Ciclo S&OP"** en la barra lateral izquierda (o navega a `/sop`).
2. Verifica el titulo de la pagina y el periodo.
3. Verifica que el stepper en la parte superior muestra los 5 pasos.
4. Revisa los 3 KPI cards del Paso 1.
5. Revisa la grafica de barras (6 meses de historial).
6. Revisa la tabla de accuracy por SKU en la parte inferior.

**Resultado esperado:**

- [ ] El titulo "Ciclo S&OP Mensual" y el texto "Marzo 2025" son visibles
- [ ] El stepper muestra: Pronostico, Colaboracion, Calidad, Inventarios, Finanzas
- [ ] El Paso 1 (Pronostico) aparece resaltado como el paso actual
- [ ] Los 3 KPI cards muestran: Asertividad Feb 2025 (87.4%), Mejora con colaboracion (+3.2 pp), Sesgo del pronostico (-2.1%)
- [ ] La grafica de barras tiene 3 series: estadistico, colaborado, real
- [ ] La tabla de accuracy muestra porcentajes por SKU
- [ ] El boton "Paso anterior" esta deshabilitado (no se puede ir atras del Paso 1)
- [ ] El boton "Confirmar y continuar" esta habilitado

**Tiempo real:** _____ min

---

## Prueba 4: Colaboracion de ventas — editar un ajuste (~5 min)

**Objetivo:** Verificar que el Paso 2 permite editar el pronostico y registrar justificaciones.

**Pasos:**

1. Desde el Paso 1, haz clic en **"Confirmar y continuar"**.
2. Verifica que el stepper avanza al Paso 2 (Colaboracion).
3. Busca la tabla de ajustes por SKU.
4. Haz clic en una celda de la columna de ajuste de cualquier SKU.
5. Cambia el numero (por ejemplo, escribe 1500).
6. Verifica que el campo de justificacion se activa automaticamente.
7. Escribe una justificacion breve (por ejemplo: "Temporada Semana Santa").
8. Haz clic en **"Confirmar y continuar"**.

**Resultado esperado:**

- [ ] El stepper muestra el Paso 2 como activo
- [ ] El titulo "Colaboracion de ventas" es visible
- [ ] La tabla tiene columnas: SKU, pronostico estadistico, ajuste, variacion (%)
- [ ] Al hacer clic en una celda de ajuste, se vuelve editable
- [ ] El campo de justificacion aparece cuando hay un ajuste diferente al original
- [ ] El boton "Confirmar y continuar" avanza al Paso 3 sin errores

**Tiempo real:** _____ min

---

## Prueba 5: Revision de calidad — radar de score (~3 min)

**Objetivo:** Verificar que el Paso 3 muestra el radar de calidad y el comparativo MAPE.

**Pasos:**

1. Despues de confirmar el Paso 2, verifica que estas en el Paso 3 (Calidad).
2. Revisa el grafico de radar en la parte superior.
3. Revisa el comparativo de MAPE por canal.
4. Haz clic en **"Confirmar y continuar"**.

**Resultado esperado:**

- [ ] El titulo "Revision de calidad" es visible
- [ ] El radar muestra 6 dimensiones: Asertividad, Colaboracion, Sesgo, Cobertura, Fill Rate, Ciclo
- [ ] El radar tiene dos areas: una de color (actual) y una gris (meta)
- [ ] El comparativo MAPE muestra valores por canal (Autoservicio, Mayoreo, Foodservice)
- [ ] El boton "Paso anterior" regresa al Paso 2 correctamente

**Tiempo real:** _____ min

---

## Prueba 6: Plan de inventarios — dias de cobertura (~4 min)

**Objetivo:** Verificar que el Paso 4 muestra el plan de reposicion con alertas criticas.

**Pasos:**

1. Desde el Paso 3, haz clic en **"Confirmar y continuar"**.
2. Verifica que estas en el Paso 4 (Inventarios).
3. Revisa la grafica de dias de cobertura por SKU.
4. Identifica cuales SKUs estan en zona critica (barras rojas).
5. Revisa la tabla de plan de reposicion.
6. Haz clic en **"Confirmar y continuar"**.

**Resultado esperado:**

- [ ] El titulo "Plan de inventarios" es visible
- [ ] La grafica de barras muestra dias de cobertura por SKU
- [ ] Hay una linea de referencia para el stock de seguridad (35 dias) y el minimo operativo (20 dias)
- [ ] Los SKUs DOL-POUCH y GUA-170 aparecen marcados en rojo (zona critica)
- [ ] La seccion "Plan de reposicion detallado" muestra ordenes sugeridas con cantidad y fecha

**Tiempo real:** _____ min

---

## Prueba 7: Validacion financiera — aprobar el plan (~5 min)

**Objetivo:** Verificar que el Paso 5 muestra el P&L, los riesgos, y que el flujo de aprobacion funciona.

**Pasos:**

1. Desde el Paso 4, haz clic en **"Confirmar y continuar"**.
2. Verifica que estas en el Paso 5 (Finanzas).
3. Revisa el P&L proyectado vs presupuesto (4 tarjetas).
4. Revisa los riesgos financieros identificados.
5. Escribe un comentario en el campo de texto (por ejemplo: "Plan aprobado con nota sobre COGS").
6. Haz clic en **"Aprobar plan Mar 2025"**.
7. Verifica el mensaje de confirmacion.
8. Haz clic en **"Cambiar decision"** para restablecer el estado.
9. Ahora haz clic en **"Devolver con observaciones"**.
10. Verifica el mensaje de rechazo.

**Resultado esperado:**

- [ ] El titulo "Validacion financiera" es visible
- [ ] El P&L muestra 4 tarjetas: Ventas netas ($148M), COGS ($97.2M), Margen bruto (34.3%), Capital de trabajo ($301.2M)
- [ ] Cada tarjeta muestra la variacion vs presupuesto con color verde (favorable) o rojo (desfavorable)
- [ ] Los riesgos muestran 4 items con severidades: 2 Alta, 1 Media, 1 Baja
- [ ] Al hacer clic en "Aprobar plan Mar 2025", aparece el mensaje "Plan Marzo 2025 aprobado" en verde
- [ ] El boton "Cambiar decision" restablece el formulario
- [ ] Al hacer clic en "Devolver con observaciones", aparece el mensaje "Plan devuelto a revision" en rojo

**Tiempo real:** _____ min

---

## Prueba 8: Simulador — alza en materias primas (~4 min)

**Objetivo:** Verificar que el Simulador responde en tiempo real al mover los sliders.

**Pasos:**

1. Haz clic en **"Simulador"** en la barra lateral izquierda (o navega a `/simulator`).
2. Verifica que los 4 sliders y el selector de horizonte son visibles.
3. Verifica que las 2 graficas cargan correctamente.
4. Mueve el slider **"Precio materia prima"** hacia la derecha hasta aproximadamente +15%.
5. Observa como cambian las metricas de impacto y las graficas en tiempo real.
6. Verifica que aparece el boton **"Reset"** en la parte superior.

**Resultado esperado:**

- [ ] Los 4 sliders son visibles: Precio materia prima, Desabasto de MP, Variacion de demanda, Stock de seguridad
- [ ] El selector de horizonte muestra 4 opciones: 1 mes, 3 meses, 6 meses, 12 meses
- [ ] Las 2 graficas renderizan: Fill Rate proyectado vs baseline, Capital de trabajo proyectado
- [ ] Al mover el slider, las graficas y las metricas de impacto cambian sin recargar la pagina
- [ ] La seccion "Impacto del escenario" muestra Fill Rate promedio, Revenue en riesgo y Delta COGS
- [ ] El boton "Reset" aparece una vez que cualquier slider se mueve
- [ ] El texto de interpretacion narrativa aparece debajo de los sliders

**Tiempo real:** _____ min

---

## Prueba 9: Simulador — desabasto severo y horizonte de tiempo (~4 min)

**Objetivo:** Verificar que el Simulador proyecta correctamente un escenario de desabasto y que el selector de horizonte funciona.

**Pasos:**

1. Desde el Simulador, asegurate de que todos los sliders esten en valor default (haz clic en "Reset" si es necesario).
2. Mueve el slider **"Desabasto de MP"** hasta aproximadamente 40%.
3. Observa el impacto en la grafica de Fill Rate proyectado.
4. Cambia el horizonte de **"3 meses"** a **"12 meses"**.
5. Verifica que la grafica se extiende para mostrar 12 meses de proyeccion.
6. Cambia el horizonte a **"1 mes"**.
7. Haz clic en **"Reset"** al terminar.

**Resultado esperado:**

- [ ] Con desabasto 40%, la linea de Fill Rate proyectado cae por debajo del baseline
- [ ] La metrica "Fill Rate promedio" en el panel de impacto muestra un porcentaje menor al default
- [ ] Al cambiar a "12 meses", la grafica muestra mas puntos de datos
- [ ] Al cambiar a "1 mes", la grafica se reduce a 1 punto
- [ ] El boton "Reset" devuelve todos los sliders a sus valores default (Stock de seguridad debe volver a "33d")
- [ ] Despues del Reset, el boton "Reset" desaparece

**Tiempo real:** _____ min

---

## Prueba 10: Simulador — advertencia de riesgo extremo (~3 min)

**Objetivo:** Verificar que el banner de advertencia aparece cuando los valores entran en zona de riesgo critico.

**Pasos:**

1. Desde el Simulador (con valores en default), mueve el slider **"Desabasto de MP"** hasta aproximadamente 65%.
2. Mueve el slider **"Variacion de demanda"** hasta aproximadamente +35%.
3. Verifica que aparece un banner de advertencia en la parte superior de la pantalla.
4. Lee el mensaje del banner.
5. Ahora reduce el slider de "Desabasto de MP" a 30%.
6. Verifica que el banner desaparece.

**Resultado esperado:**

- [ ] Con desabasto > 60% Y demanda > 30%, aparece un banner rojo con el mensaje "Valor fuera de rangos aceptables"
- [ ] El banner es claramente visible (no requiere hacer scroll para verlo)
- [ ] Al reducir el desabasto a 30%, el banner desaparece automaticamente sin recargar la pagina
- [ ] El resto del Simulador sigue funcionando normalmente mientras el banner esta visible

**Tiempo real:** _____ min

---

## Resumen de pruebas

| # | Prueba | Tiempo est. | Resultado |
|---|--------|-------------|-----------|
| 1 | Cargar la pantalla de inicio | ~3 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 2 | Navegar al Dashboard Directivo | ~5 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 3 | Iniciar el ciclo S&OP — Paso 1 Pronostico | ~5 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 4 | Colaboracion de ventas — editar un ajuste | ~5 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 5 | Revision de calidad — radar de score | ~3 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 6 | Plan de inventarios — dias de cobertura | ~4 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 7 | Validacion financiera — aprobar el plan | ~5 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 8 | Simulador — alza en materias primas | ~4 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 9 | Simulador — desabasto severo y horizonte | ~4 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| 10 | Simulador — advertencia de riesgo extremo | ~3 min | [ ] Paso &nbsp;&nbsp; [ ] Fallo |
| | **TOTAL** | **~41 min** | |

**Tester:** _____________________

**Fecha:** _____________________

**Version del demo:** 0.3.0

**Ultima actualizacion:** 2026-04-01
