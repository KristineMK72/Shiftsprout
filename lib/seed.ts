import { prisma } from "@/lib/prisma";

/** Ensures a rural clinic demo tenant exists when DB is empty. */
export async function ensureDemoData() {
  const count = await prisma.location.count();
  if (count > 0) return;

  const tenant = await prisma.tenant.create({
    data: {
      name: "Northwoods Clinic",
      slug: "northwoods-clinic",
      plan: "sprout",
    },
  });

  const location = await prisma.location.create({
    data: {
      tenantId: tenant.id,
      name: "Main Clinic",
      city: "Brainerd",
      state: "MN",
      timezone: "America/Chicago",
    },
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        locationId: location.id,
        email: "sam@northwoods.example",
        name: "Sam Rivera",
        role: "manager",
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        locationId: location.id,
        email: "jordan@northwoods.example",
        name: "Jordan Lee",
        role: "employee",
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        locationId: location.id,
        email: "casey@northwoods.example",
        name: "Casey Kim",
        role: "employee",
      },
    }),
  ]);

  const now = new Date();
  const day = (offset: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  await prisma.shift.createMany({
    data: [
      {
        locationId: location.id,
        userId: users[1].id,
        role: "Front Desk",
        startTime: day(0, 8),
        endTime: day(0, 16),
        status: "scheduled",
      },
      {
        locationId: location.id,
        userId: users[2].id,
        role: "Nurse",
        startTime: day(0, 9),
        endTime: day(0, 17),
        status: "scheduled",
      },
      {
        locationId: location.id,
        userId: null,
        role: "Front Desk",
        startTime: day(1, 16),
        endTime: day(1, 22),
        status: "open",
        notes: "Evening coverage needed",
      },
    ],
  });

  await prisma.ptoRequest.createMany({
    data: [
      {
        userId: users[1].id,
        startDate: day(7, 0),
        endDate: day(9, 0),
        type: "vacation",
        status: "pending",
        note: "Family visit",
      },
      {
        userId: users[2].id,
        startDate: day(3, 0),
        endDate: day(3, 0),
        type: "sick",
        status: "pending",
        note: "Half day AM",
      },
    ],
  });
}
