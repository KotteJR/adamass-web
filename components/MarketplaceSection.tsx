import { SITE_EMAIL } from "@/lib/site";
import {
  marketplaceCatalogHref,
  marketplaceListings,
  marketplaceNotes,
} from "@/lib/marketplace";
import AwsLogo from "./AwsLogo";
import MarketArrow from "./MarketArrow";
import MarketplaceGlyph from "./MarketplaceGlyph";
import MarketMosaic from "./MarketMosaic";

export default function MarketplaceSection() {
  return (
    <section
      id="marketplace"
      className="marketplace-section"
      aria-labelledby="marketplace-title"
    >
      <div className="page-shell">
        <div className="section-intro">
          <h2 id="marketplace-title" className="market-title">
            <AwsLogo />
          </h2>
          <p>
            Our core services, bought the way your procurement already works.
            They run through the cloud agreement you already have and land on
            the bill you already pay. Senior delivery, one named lead, written
            handover.
          </p>
        </div>

        <div className="market-cards">
          {marketplaceListings.map((listing) => (
            <article key={listing.id} className="market-card">
              <MarketplaceGlyph kind={listing.glyph} />
              <h3>{listing.title}</h3>
              <p className="market-card-body">{listing.body}</p>
              <div className="market-specs">
                {listing.specs.map((spec) => (
                  <div key={spec.k} className="market-spec">
                    <p>{spec.k}</p>
                    <p>{spec.v}</p>
                  </div>
                ))}
              </div>
              <a
                className="market-go"
                href={listing.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on AWS Marketplace
                <MarketArrow />
              </a>
            </article>
          ))}
        </div>

        <div className="market-notes">
          {marketplaceNotes.map((note) => (
            <div key={note.title}>
              <p className="market-note-title">{note.title}</p>
              <p>{note.body}</p>
            </div>
          ))}
        </div>

        <div className="market-cta">
          <MarketMosaic />
          <div className="market-cta-copy">
            <p className="market-cta-kicker">
              Private offers, issued within a week
            </p>
            <p className="market-cta-title">
              Tell us which package, and what you&apos;re trying to get done.
            </p>
            <p className="market-cta-mail">
              Or write straight to{" "}
              <a className="market-mail" href={`mailto:${SITE_EMAIL}`}>
                {SITE_EMAIL}
              </a>
            </p>
          </div>
          <div className="market-cta-action">
            <a
              className="market-cta-btn"
              href={marketplaceCatalogHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on AWS Marketplace
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
