# PINSA Torre de Control de Planeación

Demo interactivo de plataforma S&OP/IBP para mostrar a PINSA el valor de orquestar su cadena de valor.

**Version:** 0.1.0 · **Status:** Demo V0

---

## Funcionalidad implementada

- [x] **Home / Role selector** — Landing page con KPIs actuales y acceso por rol
- [x] **Dashboard Directivo** — KPI cards (Fill Rate, Asertividad, Inventario, Capital de trabajo), alertas activas, gráficas de tendencia (12 meses)
- [x] **Ciclo S&OP Mensual (5 pasos):**
  - [x] Paso 1: Pronóstico estadístico con accuracy por SKU
  - [x] Paso 2: Colaboración de ventas (tabla editable con ajustes y justificaciones)
  - [x] Paso 3: Revisión de calidad (comparativo MAPE, radar score)
  - [x] Paso 4: Plan de inventarios (días de cobertura, órdenes de reposición)
  - [x] Paso 5: Validación financiera (P&L, riesgos, aprobación)
- [x] **Simulador de Escenarios** — 4 variables (precio MP, desabasto, demanda, política inventario), horizonte 1–12 meses, gráficas reactivas en tiempo real

## Pendientes (V1)

- [ ] Datos reales vía API (PostgreSQL)
- [ ] Autenticación por rol
- [ ] Multi-tenant (soporte para más clientes)
- [ ] Export PDF/Excel del plan S&OP
- [ ] Notificaciones y alertas automáticas

## Cómo correr localmente

```bash
npm install
npm run dev
# Abre http://localhost:3000
```

## Cómo hacer build

```bash
npm run build
npm run start
```

## Deploy en Railway

1. Conecta el repo GitHub en Railway
2. Railway detecta Next.js automáticamente
3. No se requieren variables de entorno en V0
4. El deploy ocurre en cada `git push` a `main`

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Recharts · lucide-react · Railway
