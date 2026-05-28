'use client'

import { Line, LineChart, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type DashboardChartsProps = {
  volunteersByMonth: { month: string; count: number }[]
  registrationsByStatus: { status: string; count: number }[]
}

export function DashboardCharts({
  volunteersByMonth,
  registrationsByStatus,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Voluntários por mês</CardTitle>
          <CardDescription>Cadastros de voluntários nos últimos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: 'Voluntários', color: 'var(--chart-1)' },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volunteersByMonth}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inscrições por status</CardTitle>
          <CardDescription>Distribuição das inscrições em eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: 'Inscrições' },
              PENDING: { label: 'Pendente', color: 'var(--chart-2)' },
              APPROVED: { label: 'Aprovado', color: 'var(--chart-3)' },
              REJECTED: { label: 'Rejeitado', color: 'var(--chart-4)' },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={registrationsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="var(--color-count)"
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
