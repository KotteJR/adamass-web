import { ProductStage, stageSize } from "@/components/products/stages/ProductStage";
import { workProducts, workSection } from "@/content/work";
import { ModelPanel } from "./ModelPanel";
import { OverviewPanel } from "./OverviewPanel";
import type { ProductView } from "./ProductModalBody";
import { StackPanel } from "./StackPanel";
import { WorkDialog } from "./WorkDialog";

/** Renders every product's stages and panels on the server, for the client modal to show. */
export function WorkModal() {
  const products: ProductView[] = workProducts.map((product) => ({
    slug: product.slug,
    name: product.name,
    label: product.modal.label,
    title: product.modal.title,
    cta: product.modal.cta,
    stage: { node: <ProductStage stage={product.stage} variant="modal" />, ...stageSize(product.stage, "modal") },
    stageSheet: { node: <ProductStage stage={product.stage} variant="sheet" />, ...stageSize(product.stage, "sheet") },
    panels: {
      overview: <OverviewPanel overview={product.modal.overview} />,
      model: <ModelPanel model={product.modal.model} />,
      stack: <StackPanel stack={product.modal.stack} />,
    },
  }));
  return <WorkDialog products={products} labels={workSection.modal} />;
}
