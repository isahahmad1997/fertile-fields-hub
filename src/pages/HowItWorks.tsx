import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ClipboardList,
  MapPin,
  FlaskConical,
  BarChart3,
  FileSpreadsheet,
  Download,
  CheckCircle,
} from "lucide-react";
import gisMapImage from "@/assets/gis-map.jpg";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Request Service",
    description:
      "Contact us with your farm details including location, total hectares, and crop type. We'll provide a customized quote and schedule the sampling visit.",
    details: [
      "Submit request via contact form or phone",
      "Receive customized quote within 24 hours",
      "Schedule convenient sampling date",
    ],
  },
  {
    number: "02",
    icon: MapPin,
    title: "Precision Soil Sampling",
    description:
      "Our field technicians visit your farm to collect geo-referenced soil samples using GPS equipment, following a grid or zone-based sampling pattern.",
    details: [
      "GPS-tagged sample points",
      "Grid or zone sampling patterns",
      "Field boundary mapping",
    ],
  },
  {
    number: "03",
    icon: FlaskConical,
    title: "Laboratory Analysis",
    description:
      "Samples are analyzed in certified labs for nitrogen, phosphorus, potassium, pH, organic matter, and optional micronutrients.",
    details: [
      "Certified laboratory testing",
      "Complete nutrient profile",
      "Quality-assured results",
    ],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "GIS Mapping & Analysis",
    description:
      "Using QGIS and spatial interpolation, we create detailed fertility maps showing nutrient distribution patterns across your fields.",
    details: [
      "Spatial interpolation modeling",
      "Multi-layer fertility maps",
      "Management zone delineation",
    ],
  },
  {
    number: "05",
    icon: FileSpreadsheet,
    title: "VRA Prescription Generation",
    description:
      "We generate variable-rate application maps that specify exact fertilizer rates for each zone or grid point of your field.",
    details: [
      "Crop-specific recommendations",
      "Equipment-compatible formats",
      "Cost optimization analysis",
    ],
  },
  {
    number: "06",
    icon: Download,
    title: "Deliverables & Support",
    description:
      "Access your maps and reports through our client portal. Download PDF maps, view GIS outputs, and get ongoing support from our agronomists.",
    details: [
      "Secure client portal access",
      "Multiple download formats",
      "Expert agronomist support",
    ],
  },
];

const deliverables = [
  "Soil Test Report (PDF)",
  "Nitrogen (N) Fertility Map",
  "Phosphorus (P) Fertility Map",
  "Potassium (K) Fertility Map",
  "pH Distribution Map",
  "Organic Matter Map",
  "VRA Prescription Map(s)",
  "Management Zone Map",
  "Fertilizer Recommendations Report",
  "Cost Savings Analysis",
];

export default function HowItWorks() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-earth">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              How It Works
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              From Field to Actionable Insights
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              Our streamlined 6-step process transforms soil samples into precision prescriptions that you can apply immediately in the field.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              <div className="space-y-12 lg:space-y-16">
                {steps.map((step, index) => (
                  <div key={index} className="relative flex gap-6 lg:gap-8">
                    {/* Step Number Circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-hero flex items-center justify-center shadow-medium">
                        <span className="text-primary-foreground font-bold text-sm lg:text-base">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1 lg:pt-3">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="w-5 h-5 text-accent" />
                        <h3 className="font-serif text-xl lg:text-2xl text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-lg mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, dIndex) => (
                          <li key={dIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-leaf-green flex-shrink-0" />
                            <span className="text-foreground text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                What You Receive
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4 mb-6">
                Comprehensive Deliverables
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Every project includes a complete package of maps, reports, and recommendations that you can access through our secure client portal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliverables.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-card rounded-lg px-4 py-3 border border-border"
                  >
                    <CheckCircle className="w-4 h-4 text-leaf-green flex-shrink-0" />
                    <span className="text-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-strong">
                <img
                  src={gisMapImage}
                  alt="GIS map deliverable example"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-xl px-6 py-4 shadow-medium">
                <p className="font-bold text-2xl">24-48h</p>
                <p className="text-sm opacity-90">Turnaround Time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              Project Timeline
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mt-4 mb-6">
              From Request to Results
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { day: "Day 1", title: "Request & Quote", desc: "Submit your request and receive a quote" },
              { day: "Day 2-3", title: "Field Sampling", desc: "On-site soil sample collection" },
              { day: "Day 4-7", title: "Lab Analysis", desc: "Certified laboratory testing" },
              { day: "Day 8-10", title: "Delivery", desc: "Maps and reports ready for download" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold mb-4">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.day}</p>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Submit your service request today and start your journey toward precision farming.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">
                  Request a Service
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
