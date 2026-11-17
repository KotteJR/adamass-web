import type { ComponentType } from "react";
import type { ServiceId } from "@/content/services";
import { DiligenceFigure } from "./DiligenceFigure";
import { EmbeddedDeliveryFigure } from "./EmbeddedDeliveryFigure";
import { GenAiFigure } from "./GenAiFigure";
import { ModernisationFigure } from "./ModernisationFigure";
import { Soc2Figure } from "./Soc2Figure";

/** Each service's isometric figure: on the home page's Five ways in and on the service's own page. */
export const SERVICE_FIGURES: Record<ServiceId, ComponentType<{ label?: string }>> = {
  embedded: EmbeddedDeliveryFigure,
  modernisation: ModernisationFigure,
  diligence: DiligenceFigure,
  genai: GenAiFigure,
  soc2: Soc2Figure,
};
