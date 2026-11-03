import { PageHeader, Notice, LEGAL_REVIEW_NOTE } from "@/components/ui";
import ContactCard from "@/components/ContactCard";
import { CONTACTS, SECTOR_LABEL } from "@/lib/data/contacts";
import type { Contact } from "@/lib/data/types";

export const metadata = { title: "ช่องทางติดต่อ · Legally Blonde" };

export default function ContactsPage() {
  const sectors = Object.keys(SECTOR_LABEL) as Contact["sector"][];
  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle="รวมช่องทางติดต่อกระทรวงแรงงาน หน่วยงานรัฐ ความช่วยเหลือทางกฎหมาย และองค์กรภาคประชาสังคมที่เกี่ยวข้อง"
        crumbs={[{ href: "/contacts", label: "Contacts" }]}
      />
      <div className="container-page mt-6 space-y-10">
        {sectors.map((s) => (
          <section key={s}>
            <h2 className="mb-3 text-lg font-bold">{SECTOR_LABEL[s]}</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {CONTACTS.filter((c) => c.sector === s).map((c) => (
                <ContactCard key={c.id} c={c} />
              ))}
            </div>
          </section>
        ))}
        <Notice tone="warn">{LEGAL_REVIEW_NOTE}</Notice>
      </div>
    </>
  );
}
