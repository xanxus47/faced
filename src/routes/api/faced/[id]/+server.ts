import { json } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
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
      WHERE s.id = ${params.id}
      GROUP BY s.id
    `;

		if (submissions.length === 0) {
			return json({ error: 'Record not found' }, { status: 404 });
		}

		return json(submissions[0]);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error('Fetch single error:', msg);
		return json({ error: msg }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const body = await request.json();

	try {
		if (!DATABASE_URL) throw new Error('DATABASE_URL is not set in environment variables');
		const sql = neon(DATABASE_URL);
		
		await sql`
      UPDATE faced_submissions SET
        serial_number = ${body.serialNumber || null},
        region = ${body.region},
        province = ${body.province},
        city_municipality = ${body.cityMunicipality},
        district = ${body.district || null},
        barangay = ${body.barangay || null},
        evacuation_center = ${body.evacuationCenter || null},
        last_name = ${body.lastName || null},
        first_name = ${body.firstName || null},
        middle_name = ${body.middleName || null},
        name_ext = ${body.nameExt || null},
        birthdate = ${body.birthdate || null},
        age = ${body.age ? parseInt(body.age) : null},
        birthplace = ${body.birthplace || null},
        sex = ${body.sex || null},
        civil_status = ${body.civilStatus || null},
        mothers_maiden_name = ${body.mothersMaidenName || null},
        religion = ${body.religion || null},
        occupation = ${body.occupation || null},
        monthly_income = ${body.monthlyIncome || null},
        id_card_presented = ${body.idCardPresented || null},
        id_card_number = ${body.idCardNumber || null},
        contact_primary = ${body.contactPrimary || null},
        contact_alternate = ${body.contactAlternate || null},
        addr_house_no = ${body.address?.houseNo || null},
        addr_street = ${body.address?.street || null},
        addr_subdivision = ${body.address?.subdivision || null},
        addr_barangay = ${body.address?.barangay || null},
        addr_city = ${body.address?.city || null},
        addr_province = ${body.address?.province || null},
        addr_zipcode = ${body.address?.zipcode || null},
        is_4ps = ${body.is4Ps ?? false},
        ip_ethnicity = ${body.ipEthnicity || null},
        house_ownership = ${body.houseOwnership || null},
        shelter_damage = ${body.shelterDamage || null}
      WHERE id = ${params.id}
    `;

		await sql`DELETE FROM faced_family_members WHERE submission_id = ${params.id}`;

		const members = (body.familyMembers || [])
			.map((m: any, i: number) => ({ ...m, order: i + 1 }))
			.filter((m: any) => m.name?.trim());

		for (const m of members) {
			await sql`
        INSERT INTO faced_family_members (
          submission_id, member_order, name, relation, birthdate, age, sex, education, occupation, vulnerability
        ) VALUES (
          ${params.id}, ${m.order},
          ${m.name || null}, ${m.relation || null},
          ${m.birthdate || null}, ${m.age ? parseInt(String(m.age)) : null},
          ${m.sex || null}, ${m.education || null}, ${m.occupation || null}, ${m.vulnerability || null}
        )
      `;
		}

		return json({ success: true, id: params.id });
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error('Update error:', msg);
		return json({ success: false, error: msg }, { status: 500 });
	}
};
