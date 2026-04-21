# Datos del Demo — UAT v0.5.0

> **Última actualización:** Abril 2026 · **Ciclo S&OP activo:** Abril 2026 · **Alineado con propuesta Arena Analytics** (E0–E6)

---

## KPIs ejecutivos actuales

| KPI | Valor | Meta | Estatus |
|-----|-------|------|---------|
| Fill Rate OTIF | 91.4% | 95.0% | 🟡 3.6pp bajo meta |
| Asertividad pronóstico | 71.2% | 75.0% | 🟡 3.8pp bajo meta |
| Cobertura inventario | 33d | 30–45d | 🟢 en rango |
| Capital de trabajo | $298.5M | $280M | 🟡 +$18.5M sobre meta |

---

## Alertas activas (Dashboard)

| Severidad | Mensaje | Impacto |
|-----------|---------|---------|
| Alta | Riesgo desabasto hojalata — impacto producción May–Jun | $18.5M |
| Alta | Precio atún +8.5% vs año anterior — COGS sobre presupuesto | $6.2M |
| Media | 32% SKUs Clase A sin colaboración comercial para Semana Santa | $4.2M |
| Media | Inventario POR-POUCH-ACE bajo mínimo (19d proyectado) | $2.8M |

---

## Portafolio de SKUs (10 totales)

| ID | Nombre | Marca | Formato | Clase ABC |
|----|--------|-------|---------|-----------|
| DOL-170-ACE | Dolores Atún en Aceite 170g | Dolores | Lata 170g | A |
| DOL-170-AGU | Dolores Atún en Agua 170g | Dolores | Lata 170g | A |
| DOL-280-ACE | Dolores Atún en Aceite 280g | Dolores | Lata 280g | B |
| DOL-FOODSVC-1KG | Dolores Atún Foodservice 1kg | Dolores | Lata 1kg | B |
| POR-POUCH-ACE | Portola Atún en Aceite Pouch 80g | Portola | Pouch 80g | A |
| MAZ-170-ACE | Mazatún Atún en Aceite 170g | Mazatún | Lata 170g | B |
| MAZ-170-AGU | Mazatún Atún en Agua 170g | Mazatún | Lata 170g | B |
| MAZ-SARD-JIT-425 | Mazatún Sardina en Jitomate 425g | Mazatún | Lata 425g | C |
| ELD-SARD-JIT-425 | El Dorado Sardina en Jitomate 425g | El Dorado | Lata 425g | B |
| ELD-SARD-ACE-215 | El Dorado Sardina en Aceite 215g | El Dorado | Lata 215g | C |

**Marcas reales PINSA:** Dolores (premium atún) · Mazatún (económico) · El Dorado (sardinas) · Portola (pouch especialidad)

---

## Canales (mix de ventas por canal — Dashboard)

| Canal | Cuentas principales | % mix |
|-------|---------------------|-------|
| Autoservicios | Walmart · Chedraui · Soriana · Bodega Aurrerá | 38% |
| Mayoristas | Zorro · 3B · Merza · Calimax | 22% |
| Conveniencia | OXXO · 7-Eleven · Super K | 14% |
| Clubes de Precio | Sam's · Costco · City Club | 12% |
| Distribuidores | Duero · Regionales | 6% |
| Foodservice | Restaurantes · cadenas institucionales | 5% |
| Exportación | LATAM · Caribe | 3% |

---

## Red de distribución

- **1 Planta** — Mazatlán (Sinaloa) · 14 líneas de producción · 2M cajas/año
- **1 CEDIS** — México (centro del país) · recibe de planta vía transporte terrestre

**Splits por clase ABC:**
- Clase A → 60% planta / 40% CEDIS (alta rotación, más cerca del canal)
- Clase B → 65 / 35 (estándar)
- Clase C → 75 / 25 (baja rotación, se queda en planta)

---

## Líneas de producción (14 líneas · planta Mazatlán)

| Línea | Formato | Capacidad sem (cajas) | Estado |
|-------|---------|----------------------:|--------|
| L1 | 170g ACE premium (DOL) | 78,000 | OK |
| L2 | 170g AGU premium (DOL) | 82,000 | OK |
| L3 | 170g ACE económico (MAZ) | 58,000 | OK |
| L4 | 170g AGU económico (MAZ) | 58,000 | OK |
| **L5** | **Pouch 80g Portola** | **95,000** | **🔴 Brecha +17K cajas** |
| L6 | 280g premium (DOL) | 48,000 | OK |
| L7 | 425g sardina premium (ELD) | 72,000 | OK |
| L8 | 425g sardina económica (MAZ) | 52,000 | OK |
| L9 | 215g sardina aceite (ELD) | 40,000 | OK |
| L10 | Foodservice 1kg | 18,000 | OK |
| L11 | Flex 170g (backup) | 55,000 | 🟡 Ajustado |
| L12 | Flex 170g | 55,000 | 🟡 Ajustado |
| L13 | Maquila / NPI | 22,000 | Holgura |
| L14 | Empaque secundario | 30,000 | OK |

---

## Brecha de producción del ciclo (L5 — Pouch 80g Portola)

- Demanda plan: **112,000 cajas/sem**
- Capacidad L5: **95,000 cajas/sem**
- Brecha: **−17,000 cajas/sem** (118% utilización)

**3 opciones modeladas para la Sesión Ejecutiva:**

| Opción | Impacto financiero | Servicio | Trade-off |
|--------|---------------------|----------|-----------|
| A · Ampliar turno nocturno | +$1.85M OPEX, +22K cajas/sem | Fill rate 95% | Sin pérdida servicio |
| B · Quiebre controlado OXXO | −$3.4M ventas perdidas | Fill rate cae a 87% | Riesgo deslistado |
| C · Renegociar plan Walmart | −$4.8M revenue redistribuido | Volumen a Dolores 170g | Riesgo relación cliente |

---

## FVA histórico por categoría de ajuste (Paso 2 — Colaboración Comercial)

| Categoría | FVA | Muestra | Hint |
|-----------|------|---------|------|
| Promoción | **+8.2%** | n=42 | Activaciones con cliente clave (Walmart, Soriana, OXXO) |
| Estacionalidad | **+6.1%** | n=36 | Cuaresma, Semana Santa, Buen Fin, Navidad |
| Lanzamiento NPI | +4.1% | n=11 | Nuevo SKU o presentación |
| Acuerdo de anaquel | +2.5% | n=28 | Frentes o exhibición negociada |
| Acción competencia | **−3.8%** | n=19 | Respuesta a Tuny o marca propia → sobre-reacción |

---

## P&L proyectado Abril 2026 (visible en Sesión Ejecutiva)

| Línea | Valor | Presupuesto | Variación |
|-------|-------|-------------|-----------|
| Ventas netas | $148.0M | $141.5M | +4.6% |
| COGS | $97.2M | $90.8M | +7.1% |
| Margen bruto | 34.3% | 35.8% | −1.5pp |
| Capital de trabajo | $301.2M | $290.0M | +3.9% |

**Riesgos financieros identificados:**
- Alta · COGS +7.1% por alza atún y hojalata → **$6.4M**
- Alta · Desabasto POR-POUCH y MAZ-170 (fill rate 89%) → **$18.5M**
- Media · Capital trabajo +$11.2M sobre plan → buffer por hojalata
- Baja · Revenue +$6.5M por mejor temporada Semana Santa

---

## Simulador — variables y rangos

| Variable | Default | Min | Max | Unidad |
|----------|---------|-----|-----|--------|
| Precio materia prima | 0% | −30% | +50% | % cambio |
| Desabasto de MP | 0% | 0% | 80% | % faltante |
| Variación de demanda | 0% | −30% | +50% | % cambio |
| Stock de seguridad | 33d | 15d | 90d | días |

**Zona de riesgo extremo:** Desabasto >60% **Y** Demanda >+30% al mismo tiempo activa banner de advertencia.

**5 KPIs del simulador:**
1. Fill Rate promedio
2. Capital de trabajo
3. **Eficiencia de producción** (4º eje añadido en v0.5)
4. Revenue en riesgo
5. Δ COGS materiales

**Escenarios:** se guardan en localStorage. Al marcarlos con el ícono de martillo aparecen en la sección "Escenarios what-if" de la Sesión Ejecutiva.

---

## Módulos del demo

| Ruta | Módulo | Para quién |
|------|--------|-----------|
| `/` | Home · Role selector | Todos |
| `/sesion-ejecutiva` | **Sesión Ejecutiva S&OP** (nuevo v0.5) | Director de Operaciones |
| `/dashboard` | Dashboard continuo | Directivos de la cadena |
| `/sop` | Ciclo S&OP mensual (5 pasos) | Planeador de Demanda · Comercial · Supply · Operaciones · Logística |
| `/simulator` | Simulador de escenarios | Planeador de Inventarios |

---

## Notas sobre los datos

- Todos los datos son **ficticios pero credibles** — construidos para reflejar la escala real de PINSA (volúmenes, precios MXN, estacionalidad mexicana).
- Marcas (**Dolores, Mazatún, El Dorado, Portola**), cuentas (**Walmart, Sam's, OXXO, etc.**) y estructura de canales son **reales** según brief comercial Arena Analytics PINSA 2026.
- En producción, estos datos vendrían de SAP via conectores (SD, MM/WM, PP, LE/TM) — v1 de lectura, sin escritura bidireccional.
