# PINSA Torre de Control de Planeacion — Resumen del Sistema

**Version:** 0.3.0 · **Fecha:** Abril 2025 · **Estado:** Demo listo para presentacion

---

## Que es este sistema

Una plataforma web interactiva que permite a los equipos de PINSA orquestar su cadena de valor completa — desde el pronostico de demanda hasta la validacion financiera — en un unico flujo S&OP mensual.

El demo muestra como se veria la herramienta con datos reales de PINSA (atun, sardinas, productos empacados) en produccion.

---

## Modulos disponibles

| Modulo | Ruta | Para quien |
|---|---|---|
| **Home** | `/` | Todos — selector de rol |
| **Dashboard Directivo** | `/dashboard` | Director General, Direccion Comercial |
| **Ciclo S&OP Mensual** | `/sop` | Planeador de Demanda, Ventas, Finanzas |
| **Simulador de Escenarios** | `/simulator` | Planeador de Inventarios, Supply Chain |

---

## Que hace cada modulo

### Dashboard Directivo
- 4 KPIs principales: Fill Rate OTIF, Asertividad de Pronostico, Cobertura de Inventario, Capital de Trabajo
- Alertas activas con severidad (Alta / Media / Baja)
- Graficas de tendencia: Fill Rate 12 meses, Ventas vs COGS, Capital de Trabajo
- Mix de ventas por canal (Autoservicio, Mayoreo, Foodservice, Exportacion)
- Top SKUs por volumen

### Ciclo S&OP — 5 pasos
1. **Pronostico** — Comparativo estadistico vs colaborado vs real. Accuracy por SKU.
2. **Colaboracion** — Tabla editable: ventas puede ajustar el pronostico y justificar el cambio.
3. **Calidad** — Radar de score de calidad del proceso S&OP, comparativo MAPE por canal.
4. **Inventarios** — Dias de cobertura por SKU, plan de reposicion con alertas criticas.
5. **Finanzas** — P&L proyectado vs presupuesto, riesgos identificados, boton de aprobacion/rechazo.

### Simulador de Escenarios
- 4 variables ajustables: precio de materia prima, desabasto de MP, variacion de demanda, stock de seguridad
- Horizonte de proyeccion: 1, 3, 6 o 12 meses
- Graficas reactivas en tiempo real: Fill Rate proyectado vs baseline, Capital de Trabajo proyectado
- Banner de advertencia cuando los valores entran en zona de riesgo extremo

---

## Numeros del sistema

| Metrica | Valor |
|---|---|
| SKUs en el sistema | 10 (Dolores, Guardamar, La Sirena) |
| Meses de historial | 12 meses + 3 meses forward |
| Materias primas | 4 (atun, sardina, hojalata, aceite) |
| Tests automatizados | 133 (88 unitarios + 45 E2E) |
| Tiempo de carga | < 2 segundos |

---

## Lo que NO incluye todavia (V1)

- Datos reales de PINSA (el demo usa datos ficticios pero credibles)
- Autenticacion (cualquiera puede acceder al demo sin login)
- Base de datos (todos los datos son archivos JSON estaticos)
- Exportacion a PDF o Excel
- Integracion con ERP o sistemas existentes

---

## Como acceder

El demo corre en Railway. Contactar a FerDi para obtener la URL actualizada.

Para correr localmente:
```
npm install
npm run dev
```
Abrir en el navegador: `http://localhost:3001`
