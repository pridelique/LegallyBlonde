import { PageHeader, Notice, LEGAL_REVIEW_NOTE } from "@/components/ui";
import ContactCard from "@/components/ContactCard";
import { CONTACTS, SECTOR_LABEL } from "@/lib/data/contacts";
import type { ContactSector } from "@/lib/data/types";

export const metadata = { title: "ช่องทางติดต่อ · Legally Blonde" };

export default function ContactsPage() {
  const sectors = Object.keys(SECTOR_LABEL) as ContactSector[];

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle="รวมช่องทางติดต่อกระทรวงแรงงาน หน่วยงานรัฐ ความช่วยเหลือทางกฎหมาย และองค์กรภาคประชาสังคมที่เกี่ยวข้อง"
        crumbs={[{ href: "/contacts", label: "Contacts" }]}
      >
      </PageHeader>

      <div className="container-page mt-6 space-y-10">
        {sectors.map((s, i) => (
          <section key={s} id={s} className="scroll-mt-24">
            <h2 className="mb-4 text-xl font-bold">
              {i + 1}. {SECTOR_LABEL[s]}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
