import { json, error } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	try {
		if (!DATABASE_URL) throw new Error('DATABASE_URL is not set in environment variables');
		const sql = neon(DATABASE_URL);
		const [submission] = await sql`
      INSERT INTO faced_submissions (
        serial_number, region, province, city_municipality, district, barangay, evacuation_center,
        last_name, first_name, middle_name, name_ext, birthdate, age, birthplace, sex,
        civil_status, mothers_maiden_name, religion, occupation, monthly_income,
        id_card_presented, id_card_number, contact_primary, contact_alternate,
        addr_house_no, addr_street, addr_subdivision, addr_barangay, addr_city, addr_province, addr_zipcode,
        is_4ps, ip_ethnicity, house_ownership, shelter_damage
      ) VALUES (
        ${body.serialNumber || null},
        ${body.region}, ${body.province}, ${body.cityMunicipality},
        ${body.district || null}, ${body.barangay || null}, ${body.evacuationCenter || null},
        ${body.lastName || null}, ${body.firstName || null}, ${body.middleName || null}, ${body.nameExt || null},
        ${body.birthdate || null}, ${body.age ? parseInt(body.age) : null},
        ${body.birthplace || null}, ${body.sex || null},
        ${body.civilStatus || null}, ${body.mothersMaidenName || null}, ${body.religion || null},
        ${body.occupation || null}, ${body.monthlyIncome || null},
        ${body.idCardPresented || null}, ${body.idCardNumber || null},
        ${body.contactPrimary || null}, ${body.contactAlternate || null},
        ${body.address?.houseNo || null}, ${body.address?.street || null},
        ${body.address?.subdivision || null}, ${body.address?.barangay || null},
        ${body.address?.city || null}, ${body.address?.province || null}, ${body.address?.zipcode || null},
        ${body.is4Ps ?? false}, ${body.ipEthnicity || null},
        ${body.houseOwnership || null}, ${body.shelterDamage || null}
      )
      RETURNING id
    `;

		const members = (body.familyMembers || [])
			.map((m: { name?: string; relation?: string; birthdate?: string; age?: string | number; sex?: string; education?: string; occupation?: string; vulnerability?: string }, i: number) => ({ ...m, order: i + 1 }))
			.filter((m: { name?: string }) => m.name?.trim());

		for (const m of members) {
			await sql`
        INSERT INTO faced_family_members (
          submission_id, member_order, name, relation, birthdate, age, sex, education, occupation, vulnerability
        ) VALUES (
          ${submission.id}, ${m.order},
          ${m.name || null}, ${m.relation || null},
          ${m.birthdate || null}, ${m.age ? parseInt(String(m.age)) : null},
          ${m.sex || null}, ${m.education || null}, ${m.occupation || null}, ${m.vulnerability || null}
        )
      `;
		}

		return json({ success: true, id: submission.id });
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error('Save error:', msg);
		return json({ success: false, error: msg }, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		if (!DATABASE_URL) throw new Error('DATABASE_URL is not set in environment variables');
		const sql = neon(DATABASE_URL);
		const submissions = await sql`
      SELECT
        s.*,
        COALESCE(
          json_agg(
            json_build_object(
              'member_order', fm.member_order,
              'name', fm.name,
              'relation', fm.relation,
              'birthdate', fm.birthdate,
              'age', fm.age,
              'sex', fm.sex,
              'education', fm.education,
              'occupation', fm.occupation,
              'vulnerability', fm.vulnerability
            ) ORDER BY fm.member_order
          ) FILTER (WHERE fm.id IS NOT NULL),
          '[]'::json
        ) AS family_members
      FROM faced_submissions s
      LEFT JOIN faced_family_members fm ON fm.submission_id = s.id
      GROUP BY s.id
      ORDER BY s.submitted_at DESC
    `;

		return json(submissions);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error('Fetch error:', msg);
		return json({ error: msg }, { status: 500 });
	}
};
