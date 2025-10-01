import Layout from "@/components/kokonutui/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ESG Reports</h1>
          <p className="text-muted-foreground mt-1">Environmental, Social, and Governance reporting dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ESG Reports will provide comprehensive sustainability metrics and compliance tracking.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
