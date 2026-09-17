import { faqs } from "@/lib/faq";

export default function FaqList() {
  return (
    <div className="faq-list">
      {faqs.map((item) => (
        <article key={item.question} className="faq-item">
          <h2>{item.question}</h2>
          <p>{item.answer}</p>
        </article>
      ))}
    </div>
  );
}
