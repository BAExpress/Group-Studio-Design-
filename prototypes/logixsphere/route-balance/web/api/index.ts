import cors from 'cors'
import express from 'express'
import multer from 'multer'

import {
  allPostcodes,
  computeKpis,
  drivers,
  getAsrDsrRows,
  getStopsSummary,
  routes,
} from './_lib/data.js'
import { parseDiscoFile } from './_lib/import-parser.js'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

app.get('/api/kpis', (_req, res) => {
  res.json(computeKpis())
})

app.get('/api/routes', (_req, res) => {
  res.json(routes)
})

app.get('/api/drivers', (_req, res) => {
  res.json(drivers)
})

app.get('/api/postcodes', (_req, res) => {
  res.json(allPostcodes)
})

app.get('/api/asr-dsr-listing', (_req, res) => {
  res.json(getAsrDsrRows())
})

app.get('/api/routes/:id/stops', (req, res) => {
  const route = routes.find((r) => r.id === req.params.id)
  if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
  res.json(getStopsSummary(route))
})

app.get('/api/routes/:id/shipment-details', (req, res) => {
  const route = routes.find((r) => r.id === req.params.id)
  if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
  res.json({
    routeId: route.code,
    driver: route.driver,
    vehicle: route.vehicle,
    totalStops: route.stopsTotal,
    deliveries: route.deliveries,
    pickups: route.pickups,
    totalWeightKg: route.totalWeightKg,
  })
})

app.post('/api/routes/:id/postcodes', (req, res) => {
  const route = routes.find((r) => r.id === req.params.id)
  if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
  const { postcodes } = req.body ?? {}
  if (!Array.isArray(postcodes) || postcodes.length === 0) {
    return res.status(400).json({ error: 'Selecione ao menos um postcode' })
  }
  postcodes.forEach((code: string) => {
    if (!route.subpostcodes.some((s) => s.code === code)) {
      route.subpostcodes.push({ code, del: 1, pu: 0, total: 1 })
    }
  })
  res.json(route)
})

app.get('/api/routes/:id/rebalance-preview', (req, res) => {
  const route = routes.find((r) => r.id === req.params.id)
  if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
  const totalStops = route.subpostcodes.reduce((sum, r) => sum + r.total, 0)
  res.json({
    routeId: route.id,
    routeCode: route.code,
    driver: route.driver,
    totalStops: totalStops || route.stopsTotal,
    progressPercent: Math.round((route.stopsDone / route.stopsTotal) * 100),
    subpostcodes: route.subpostcodes,
  })
})

app.post('/api/routes/:id/rebalance', (req, res) => {
  const route = routes.find((r) => r.id === req.params.id)
  if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
  route.capacityState = 'default'
  route.status = 'validated'
  route.stopsDone = route.stopsTotal
  res.json(route)
})

app.post('/api/routes/send-to-rebalance', (_req, res) => {
  const affected = routes.filter((r) => r.capacityState === 'rebalance')
  affected.forEach((route) => {
    route.capacityState = 'default'
    route.status = 'validated'
    route.stopsDone = route.stopsTotal
  })
  res.json({ updatedCount: affected.length, routes })
})

app.post('/api/routes/:id/validate', (req, res) => {
  const route = routes.find((r) => r.id === req.params.id)
  if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
  route.status = 'validated'
  res.json(route)
})

app.post('/api/routes', (req, res) => {
  const { code, driverId } = req.body ?? {}
  if (!code || !driverId) {
    return res.status(400).json({ error: 'code e driverId são obrigatórios' })
  }
  const driver = drivers.find((d) => d.id === driverId)
  if (!driver) return res.status(400).json({ error: 'Motorista inválido' })

  const newRoute = {
    id: `route-${Date.now()}`,
    code: code.toUpperCase(),
    driver: driver.name,
    vehicle: 'CAR-NEW',
    shift: 'AM' as const,
    status: 'pending' as const,
    capacityState: 'default' as const,
    stopsDone: 0,
    stopsTotal: 0,
    deliveries: 0,
    pickups: 0,
    preNoon: 0,
    targetPercent: 0,
    totalWeightKg: 0,
    subpostcodes: [],
    stops: [],
  }
  routes.push(newRoute)
  res.status(201).json(newRoute)
})

app.post('/api/import', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })
  try {
    const result = parseDiscoFile(req.file.buffer, req.file.originalname)
    res.json(result)
  } catch (err) {
    res.status(400).json({
      error: err instanceof Error ? err.message : 'Falha ao processar arquivo',
    })
  }
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`[route-balance-server] mock API rodando em http://localhost:${PORT}`)
})
