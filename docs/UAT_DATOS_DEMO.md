# Datos de Referencia — Demo PINSA Torre de Control

## Acceso

| Modulo | URL (Railway) | URL (Local) |
|--------|---------------|-------------|
| Home | `<URL Railway>/` | http://localhost:3001/ |
| Dashboard Directivo | `<URL Railway>/dashboard` | http://localhost:3001/dashboard |
| Ciclo S&OP | `<URL Railway>/sop` | http://localhost:3001/sop |
| Simulador | `<URL Railway>/simulator` | http://localhost:3001/simulator |

> No hay login. El demo es de acceso libre.

---

## KPIs del Dashboard (valores del demo)

| KPI | Valor | Meta | Estatus |
|-----|-------|------|---------|
| Fill Rate OTIF | 91.3% | 95% | Alerta |
| Asertividad Pronostico | 87.4% | 90% | Por mejorar |
| Cobertura Inventario | 47 dias | 35-55 dias | En meta |
| Capital de Trabajo | $301.2M MXN | < $290M | Alerta |

---

## Alertas activas (Dashboard)

| Severidad | Mensaje |
|-----------|---------|
| Alta | DOL-POUCH-ACE fill rate 79% — 3 semanas consecutivas debajo de meta |
| Alta | Precio atun alza 12% vs enero — impacto estimado $6.4M en COGS |
| Media | GUA-170-ACE cobertura 18 dias — riesgo de quiebre en 2 semanas |

---

## SKUs del sistema

| ID | Nombre | Marca | Formato |
|----|--------|-------|---------|
| DOL-170-ACE | Dolores Atun en Aceite 170g | Dolores | Lata 170g |
| DOL-170-AGU | Dolores Atun en Agua 170g | Dolores | Lata 170g |
| DOL-POUCH-ACE | Dolores Atun Pouch Aceite 100g | Dolores | Pouch 100g |
| DOL-POUCH-AGU | Dolores Atun Pouch Agua 100g | Dolores | Pouch 100g |
| GUA-170-ACE | Guardamar Atun en Aceite 170g | Guardamar | Lata 170g |
| GUA-170-AGU | Guardamar Atun en Agua 170g | Guardamar | Lata 170g |
| GUA-SARD-425 | Guardamar Sardina en Tomate 425g | Guardamar | Lata 425g |
| SIR-SARD-425 | La Sirena Sardina en Tomate 425g | La Sirena | Lata 425g |
| SIR-SARD-213 | La Sirena Sardina en Aceite 213g | La Sirena | Lata 213g |
| DOL-MACRO-ACE | Dolores Atun Macro Aceite 280g | Dolores | Lata 280g |

---

## Materias primas del sistema

| ID | Descripcion | Unidad |
|----|-------------|--------|
| ATUN-SK | Atun skipjack congelado | USD/ton |
| SARD-PAC | Sardina del Pacifico | USD/ton |
| HOJALATA | Hojalata para latas | USD/ton |
| ACEITE-SOY | Aceite de soya refinado | USD/ton |

---

## P&L del Ciclo S&OP — Marzo 2025

| Linea | Valor real | Presupuesto | Variacion |
|-------|-----------|-------------|-----------|
| Ventas netas | $148.0M MXN | $141.5M MXN | +4.6% |
| COGS | $97.2M MXN | $90.8M MXN | +7.1% |
| Margen bruto | 34.3% | 35.8% | -1.5 pp |
| Capital de trabajo | $301.2M MXN | $290.0M MXN | +3.9% |

---

## Riesgos financieros identificados (Paso 5)

| Severidad | Descripcion | Impacto |
|-----------|-------------|---------|
| Alta | COGS +7.1% por alza atun y hojalata | $6.4M |
| Alta | Perdida de ventas por desabasto DOL-POUCH y GUA-170 | $18.5M |
| Media | Capital de trabajo $11.2M sobre plan por mayor inventario de seguridad | $11.2M |
| Baja | Revenue +$6.5M sobre plan por mejor temporada Semana Santa | +$6.5M |

---

## Simulador — valores default y rangos

| Variable | Valor default | Rango min | Rango max | Unidad |
|----------|--------------|-----------|-----------|--------|
| Precio materia prima | 0% | -30% | +50% | % cambio |
| Desabasto de MP | 0% | 0% | 100% | % faltante |
| Variacion de demanda | 0% | -50% | +50% | % cambio |
| Stock de seguridad | 33 dias | 7 dias | 90 dias | dias |

**Zona de riesgo extremo:** Desabasto > 60% Y Variacion de demanda > 30% al mismo tiempo activa el banner de advertencia.

---

## Mix de ventas por canal (Dashboard)

| Canal | Participacion |
|-------|--------------|
| Autoservicio | 45% |
| Mayoreo | 28% |
| Foodservice | 18% |
| Exportacion | 9% |

---

## Top SKUs por volumen (Dashboard)

| Posicion | SKU | Volumen (cajas/mes) |
|----------|-----|---------------------|
| 1 | Dolores Atun Agua 170g | 48,200 |
| 2 | Dolores Atun Aceite 170g | 41,500 |
| 3 | Guardamar Atun Aceite 170g | 29,800 |
| 4 | La Sirena Sardina Tomate 425g | 22,100 |
| 5 | Dolores Atun Pouch Aceite 100g | 18,700 |

---

## Notas sobre los datos

- Todos los datos son ficticios pero construidos para reflejar la escala real de PINSA.
- Los nombres de marca (Dolores, Guardamar, La Sirena) son los reales.
- Los numeros financieros (ventas, COGS, capital de trabajo) estan en ordenes de magnitud reales para una empresa CPG de este tamano en Mexico.
- En produccion (V1) estos datos vendrian del ERP de PINSA en tiempo real.
