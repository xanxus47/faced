<script>
  import dswdLogo from '$lib/assets/dswd.png';

  const CHECK = '\u2714';

  let isPrinting = false;

  function calculateAge(birthdateStr) {
    if (!birthdateStr) return '';
    const today = new Date();
    const birth = new Date(birthdateStr);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? String(age) : '';
  }

  $: formData.age = calculateAge(formData.birthdate);

  let formData = {
    serialNumber: '',
    region: 'MIMAROPA IV-B',
    province: 'OCCIDENTAL MINDORO',
    cityMunicipality: 'MAGSAYSAY',
    district: '',
    barangay: '',
    evacuationCenter: '',
    
    lastName: '',
    firstName: '',
    middleName: '',
    nameExt: '',
    birthdate: '',
    age: '',
    birthplace: '',
    sex: '',
    
    civilStatus: '',
    mothersMaidenName: '',
    religion: '',
    occupation: '',
    monthlyIncome: '',
    idCardPresented: '',
    idCardNumber: '',
    contactPrimary: '',
    contactAlternate: '',
    
    address: {
      houseNo: '',
      street: '',
      subdivision: '',
      barangay: '',
      city: '',
      province: 'OCCIDENTAL MINDORO',
      zipcode: ''
    },
    
    is4Ps: false,
    ipEthnicity: '',
    
    familyMembers: Array.from({ length: 15 }, () => ({
      name: '',
      relation: '',
      birthdate: '',
      age: '',
      sex: '',
      education: '',
      occupation: '',
      vulnerability: ''
    })),
    
    houseOwnership: '', // Owner, Renter, Sharer
    shelterDamage: '' // Partially Damaged, Totally Damaged
  };

  function handlePrint() {
    window.print();
  }

  function handleSubmit() {
    isPrinting = true;
    setTimeout(() => {
      window.print();
      isPrinting = false;
    }, 100);
  }
</script>

<div class="app-container {isPrinting ? 'print-mode' : ''}">
  {#if !isPrinting}
    <div class="user-interface">
      <div class="header">
        <h1>FACED Form Entry</h1>
        <p>Fill out the details below to generate the Family Assistance Card in Emergencies and Disasters.</p>
      </div>

      <form on:submit|preventDefault={handleSubmit} class="space-y-8">
        <!-- LOCATION OF THE AFFECTED FAMILY -->
        <section>
          <h2>Location of the Affected Family</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group"><label>1. Region</label><input type="text" bind:value={formData.region} readonly /></div>
            <div class="form-group"><label>4. District</label><input type="text" bind:value={formData.district} /></div>
            <div class="form-group"><label>2. Province</label><input type="text" bind:value={formData.province} readonly /></div>
            <div class="form-group"><label>5. Barangay</label>
              <select bind:value={formData.barangay}>
                <option value="">-- Select Barangay --</option>
                <option>ALIBOG</option>
                <option>CAGURAY</option>
                <option>CALAWAG</option>
                <option>GAPASAN</option>
                <option>LASTE</option>
                <option>LOURDES</option>
                <option>NICOLAS</option>
                <option>PACLOLO</option>
                <option>POBLACION</option>
                <option>PURNAGA</option>
                <option>SIBALAT</option>
                <option>STA. TERESA</option>
              </select>
            </div>
            <div class="form-group"><label>3. City/Municipality</label><input type="text" bind:value={formData.cityMunicipality} readonly /></div>
            <div class="form-group"><label>6. Evacuation Center/Site</label><input type="text" bind:value={formData.evacuationCenter} /></div>
          </div>
        </section>

        <!-- HEAD OF THE FAMILY -->
        <section>
          <h2>Head of the Family</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group"><label>7. Last Name</label><input type="text" bind:value={formData.lastName} /></div>
            <div class="form-group"><label>15. Civil Status</label>
              <select bind:value={formData.civilStatus}>
                <option value="">-- Select Civil Status --</option>
                <option>MARRIED</option>
                <option>SEPARATED</option>
                <option>SINGLE</option>
                <option>WIDOWED</option>
              </select>
            </div>
            
            <div class="form-group"><label>8. First Name</label><input type="text" bind:value={formData.firstName} /></div>
            <div class="form-group"><label>16. Mother's Maiden Name</label><input type="text" bind:value={formData.mothersMaidenName} /></div>
            
            <div class="form-group"><label>9. Middle Name</label><input type="text" bind:value={formData.middleName} /></div>
            <div class="form-group"><label>17. Religion</label>
              <select bind:value={formData.religion}>
                <option value="">-- SELECT RELIGION --</option>
                <option>AGLIPAYAN (PHILIPPINE INDEPENDENT CHURCH)</option>
                <option>ANGLICANISM (EPISCOPAL CHURCH)</option>
                <option>ASSEMBLIES OF GOD</option>
                <option>BAHA'I FAITH</option>
                <option>BUDDHISM</option>
                <option>CHURCH OF CHRIST, SCIENTIST</option>
                <option>CHURCH OF GOD WORLD MISSIONS</option>
                <option>EASTERN ORTHODOXY</option>
                <option>EVANGELICAL CHRISTIANITY</option>
                <option>HINDUISM</option>
                <option>IGLESIA NI CRISTO</option>
                <option>ISLAM</option>
                <option>JEHOVAH'S WITNESSES</option>
                <option>JUDAISM</option>
                <option>LUTHERAN CHURCH IN THE PHILIPPINES</option>
                <option>MEMBERS CHURCH OF GOD INTERNATIONAL</option>
                <option>METHODISM (UNITED METHODIST CHURCH)</option>
                <option>PHILIPPINE BENEVOLENT MISSIONARIES ASSOCIATION</option>
                <option>ROMAN CATHOLICISM</option>
                <option>SEVENTH-DAY ADVENTIST CHURCH</option>
                <option>THE CHURCH OF JESUS CHRIST OF LATTER-DAY SAINTS</option>
                <option>TRADITIONAL ANITISM / DAYAWISM (INDIGENOUS RELIGIONS)</option>
                <option>UNITED CHURCH OF CHRIST IN THE PHILIPPINES</option>
              </select>
            </div>
            
            <div class="form-group"><label>10. Name Ext. (Jr., Sr., I)</label>
              <select bind:value={formData.nameExt}>
                <option value="">-- None --</option>
                <option>JR.</option>
                <option>SR.</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
              </select>
            </div>
            <div class="form-group"><label>18. Occupation</label><input type="text" bind:value={formData.occupation} /></div>
            
            <div class="form-group"><label>11. Birthdate</label><input type="date" bind:value={formData.birthdate} /></div>
            <div class="form-group"><label>19. Monthly Family Net Income</label><input type="text" bind:value={formData.monthlyIncome} /></div>
            
            <div class="form-group"><label>12. Age</label><input type="number" bind:value={formData.age} /></div>
            <div class="form-group"><label>20. ID Card Presented</label>
              <select bind:value={formData.idCardPresented}>
                <option value="">-- Select ID --</option>
                <option>Driver's License</option>
                <option>GSIS ID</option>
                <option>PhilHealth ID</option>
                <option>Philippine Passport</option>
                <option>PRC ID</option>
                <option>Postal ID</option>
                <option>PWD ID</option>
                <option>Senior Citizen Card</option>
                <option>TIN ID</option>
                <option>Unified Multi-Purpose ID (UMID)</option>
                <option>Voter's ID</option>
              </select>
            </div>
            
            <div class="form-group"><label>13. Birthplace</label><input type="text" bind:value={formData.birthplace} /></div>
            <div class="form-group"><label>21. ID Card Number</label><input type="text" bind:value={formData.idCardNumber} /></div>
            
            <div class="form-group">
              <label>14. Sex</label>
              <select bind:value={formData.sex}>
                <option value="">Select...</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="form-group"><label>22. Primary Contact</label><input type="text" bind:value={formData.contactPrimary} /></div>
              <div class="form-group"><label>22. Alternate Contact</label><input type="text" bind:value={formData.contactAlternate} /></div>
            </div>
          </div>
          
          <h3 class="mt-4 font-bold">23. Permanent Address</h3>
          <div class="grid grid-cols-3 gap-2 mt-2">
            <div class="form-group"><label>House/Block/Lot No.</label><input type="text" bind:value={formData.address.houseNo} /></div>
            <div class="form-group"><label>Street</label><input type="text" bind:value={formData.address.street} /></div>
            <div class="form-group"><label>Subdivision/Village</label><input type="text" bind:value={formData.address.subdivision} /></div>
            <div class="form-group"><label>Barangay</label><input type="text" bind:value={formData.address.barangay} /></div>
            <div class="form-group"><label>City/Municipality</label><input type="text" bind:value={formData.address.city} /></div>
            <div class="form-group"><label>Province</label><input type="text" bind:value={formData.address.province} readonly /></div>
            <div class="form-group"><label>Zipcode</label><input type="text" bind:value={formData.address.zipcode} /></div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="form-group flex items-center gap-2">
              <input type="checkbox" id="is4ps" bind:checked={formData.is4Ps} />
              <label for="is4ps">24. 4Ps Beneficiary</label>
            </div>
            <div class="form-group"><label>IP - Type of Ethnicity</label><input type="text" bind:value={formData.ipEthnicity} /></div>
          </div>
        </section>

        <!-- FAMILY INFORMATION -->
        <section>
          <h2>25. Family Information</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th>Family Members</th>
                  <th>Relation</th>
                  <th>Birthdate</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Educational Attainment</th>
                  <th>Occupation</th>
                  <th>Vulnerability Type</th>
                </tr>
              </thead>
              <tbody>
                {#each formData.familyMembers as member, i}
                  <tr>
                    <td><input type="text" bind:value={member.name} class="w-full" /></td>
                    <td><input type="text" bind:value={member.relation} class="w-full" /></td>
                    <td><input type="date" bind:value={member.birthdate} on:change={() => member.age = calculateAge(member.birthdate)} class="w-full" /></td>
                    <td><input type="number" bind:value={member.age} class="w-full" /></td>
                    <td>
                      <select bind:value={member.sex} class="w-full">
                        <option value=""></option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                    </td>
                    <td><input type="text" bind:value={member.education} class="w-full" /></td>
                    <td><input type="text" bind:value={member.occupation} class="w-full" /></td>
                    <td><input type="text" bind:value={member.vulnerability} class="w-full" /></td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <p class="text-xs mt-2 text-gray-500">Note: You can list up to 15 family members.</p>
          </div>
        </section>

        <!-- ADDITIONAL INFO -->
        <section>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h2 class="text-sm font-bold">26. House Ownership</h2>
              <div class="flex gap-4">
                <label><input type="radio" bind:group={formData.houseOwnership} value="Owner" /> Owner</label>
                <label><input type="radio" bind:group={formData.houseOwnership} value="Renter" /> Renter</label>
                <label><input type="radio" bind:group={formData.houseOwnership} value="Sharer" /> Sharer</label>
              </div>
            </div>
            <div>
              <h2 class="text-sm font-bold">27. Shelter Damage Classification</h2>
              <div class="flex gap-4">
                <label><input type="radio" bind:group={formData.shelterDamage} value="Partially Damaged" /> Partially Damaged</label>
                <label><input type="radio" bind:group={formData.shelterDamage} value="Totally Damaged" /> Totally Damaged</label>
              </div>
            </div>
          </div>
        </section>

        <div class="actions">
          <button type="submit" class="btn-primary">Generate & Print A4 PDF</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- PRINT VIEW (A4 Form) -->
  <div class="print-container {isPrinting ? 'block' : 'hidden'}">
    <div class="a4-page">
      <div class="form-border">
        
        <!-- Header -->
        <div class="header-section">
          <div class="logo-col">
            <img src={dswdLogo} alt="DSWD Logo" class="dswd-logo" />
          </div>
          <div class="title-col">
            <div class="rep">Republic of the Philippines</div>
            <div class="dept">Department of Social Welfare and Development</div>
            <div class="faced-title">FAMILY ASSISTANCE CARD IN EMERGENCIES AND DISASTERS (FACED)</div>
          </div>
          <div class="serial-col">
            <div class="not-for-sale">THIS CARD IS NOT FOR SALE<br/>BENEFICIARYS COPY</div>
            <div class="official-use">OFFICIAL USE ONLY</div>
            <div class="serial-box">
              <span class="serial-label">SERIAL NUMBER</span>
              <span class="serial-value">{formData.serialNumber}</span>
            </div>
          </div>
        </div>

        <!-- Scrollable middle content -->
        <div class="middle-content">

        <!-- Location -->
        <div class="section-title" style="font-weight: bold; color: black;">LOCATION OF THE AFFECTED FAMILY</div>
        <div class="grid-2-col pad-sm">
          <div class="input-row"><label>1. REGION</label><div class="box-input w-full">{formData.region}</div></div>
          <div class="input-row"><label>4. DISTRICT</label><div class="box-input w-full">{formData.district}</div></div>
          <div class="input-row"><label>2. PROVINCE</label><div class="box-input w-full">{formData.province}</div></div>
          <div class="input-row"><label>5. BARANGAY</label><div class="box-input w-full">{formData.barangay}</div></div>
          <div class="input-row"><label>3. CITY/MUNICIPALITY</label><div class="box-input w-full">{formData.cityMunicipality}</div></div>
          <div class="input-row"><label>6. EVACUATION CENTER/<br/>EVACUATION SITE</label><div class="box-input w-full">{formData.evacuationCenter}</div></div>
        </div>

        <!-- Head of Family -->
        <div class="section-title" style="font-weight: bold; color: black;">HEAD OF THE FAMILY</div>
        <div class="grid-2-col pad-sm border-bottom">
          <!-- Left Column -->
          <div class="left-col-fields">
            <div class="input-row"><label>7. LAST NAME</label><div class="box-input w-full">{formData.lastName}</div></div>
            <div class="input-row"><label>8. FIRST NAME</label><div class="box-input w-full">{formData.firstName}</div></div>
            <div class="input-row"><label>9. MIDDLE NAME</label><div class="box-input w-full">{formData.middleName}</div></div>
            <div class="input-row"><label>10. NAME EXT.<br/><span class="sub-label">(Jr., Sr., I)</span></label><div class="box-input w-full">{formData.nameExt}</div></div>
            <div class="input-row"><label>11. BIRTHDATE<br/><span class="sub-label">(Ex. 01 January 2021)</span></label><div class="box-input w-full">{formData.birthdate}</div></div>
            <div class="input-row"><label>12. AGE</label><div class="box-input w-full">{formData.age}</div></div>
            <div class="input-row"><label>13. BIRTHPLACE</label><div class="box-input w-full">{formData.birthplace}</div></div>
            <div class="input-row sex-row">
              <label>14. SEX</label>
              <div class="checkbox-group">
                <div class="check-box">{formData.sex === 'MALE' ? CHECK : ''}</div> <span>MALE</span>
                <div class="check-box ml-4">{formData.sex === 'FEMALE' ? CHECK : ''}</div> <span>FEMALE</span>
              </div>
            </div>
          </div>
          
          <!-- Right Column -->
          <div class="right-col-fields">
            <div class="input-row"><label>15. CIVIL STATUS</label><div class="box-input w-full">{formData.civilStatus}</div></div>
            <div class="input-row"><label>16. MOTHER'S MAIDEN<br/>NAME</label><div class="box-input w-full">{formData.mothersMaidenName}</div></div>
            <div class="input-row"><label>17. RELIGION</label><div class="box-input w-full">{formData.religion}</div></div>
            <div class="input-row"><label>18. OCCUPATION</label><div class="box-input w-full">{formData.occupation}</div></div>
            <div class="input-row"><label>19. MONTHLY FAMILY<br/>NET INCOME</label><div class="box-input w-full">{formData.monthlyIncome}</div></div>
            <div class="input-row"><label>20. ID CARD PRESENTED</label><div class="box-input w-full">{formData.idCardPresented}</div></div>
            <div class="input-row"><label>21. ID CARD NUMBER</label><div class="box-input w-full">{formData.idCardNumber}</div></div>
            <div class="input-row contact-row">
              <label>22. CONTACT NUMBER</label>
              <div class="box-input contact-box flex-1"><span class="tiny-label">PRIMARY</span>{formData.contactPrimary}</div>
              <div class="box-input contact-box flex-1"><span class="tiny-label">ALTERNATE</span>{formData.contactAlternate}</div>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="pad-sm address-section border-bottom" style="padding-top: 4px; padding-bottom: 6px;">
          <div class="flex">
            <label class="bold mr-2 whitespace-nowrap" style="font-size: 10px;">23. PERMANENT<br/>ADDRESS</label>
            <div class="w-full">
              <div class="box-input w-full h-8 flex items-end px-2" style="height: 24px; font-size: 11px;">
                {formData.address.houseNo} {formData.address.street} {formData.address.subdivision} {formData.address.barangay} {formData.address.city} {formData.address.province} {formData.address.zipcode}
              </div>
              <div class="address-labels flex justify-between px-2" style="font-size: 8px; padding-top: 2px;">
                <span>House/Block/Lot No.</span><span>Street</span><span>Subdivision/Village</span><span>Barangay</span><span>City/Municipality</span><span>Province</span><span>Zipcode</span>
              </div>
            </div>
          </div>
          <div class="flex items-center mt-2 others-row" style="margin-top: 6px;">
            <label class="bold mr-4" style="font-size: 10px;">24. OTHERS</label>
            <div class="check-box mr-1" style="width: 14px; height: 14px;">{formData.is4Ps ? CHECK : ''}</div> <span class="mr-6" style="font-size: 10px;">4Ps Beneficiary</span>
            <div class="check-box mr-1" style="width: 14px; height: 14px;">{formData.ipEthnicity ? CHECK : ''}</div> <span style="font-size: 10px;">IP- Type of Ethnicity <span class="underline-line">{formData.ipEthnicity}</span></span>
          </div>
        </div>

        <!-- Family Info Table -->
        <div class="section-title-light text-left pl-2">25. FAMILY INFORMATION</div>
        <table class="family-table">
          <thead>
            <tr>
              <th style="width: 20%;">FAMILY MEMBERS</th>
              <th style="width: 15%;">RELATION TO<br/>FAMILY HEAD</th>
              <th style="width: 10%;">BIRTHDATE</th>
              <th style="width: 5%;">AGE</th>
              <th style="width: 5%;">SEX</th>
              <th style="width: 20%;">HIGHEST EDUCATIONAL<br/>ATTAINMENT</th>
              <th style="width: 15%;">OCCUPATION</th>
              <th style="width: 10%;">TYPE OF<br/>VULNERABILITY</th>
            </tr>
          </thead>
          <tbody>
            {#each formData.familyMembers as member}
              <tr>
                <td>{member.name}</td>
                <td>{member.relation}</td>
                <td>{member.birthdate}</td>
                <td>{member.age}</td>
                <td>{member.sex}</td>
                <td>{member.education}</td>
                <td>{member.occupation}</td>
                <td>{member.vulnerability}</td>
              </tr>
            {/each}
          </tbody>
        </table>

        <!-- Ownership and Damage -->
        <div class="flex mt-1 damage-section" style="margin-top: 4px;">
          <div class="flex-1 border-box mr-1">
            <div class="purple-bg" style="font-size: 10px; padding: 4px; font-weight: bold; color: black;">26. HOUSE OWNERSHIP</div>
            <div class="flex justify-center gap-6 py-2" style="padding-top: 6px; padding-bottom: 6px; font-size: 10px;">
              <div class="flex items-center"><div class="check-box mr-1">{formData.houseOwnership === 'Owner' ? CHECK : ''}</div> Owner</div>
              <div class="flex items-center"><div class="check-box mr-1">{formData.houseOwnership === 'Renter' ? CHECK : ''}</div> Renter</div>
              <div class="flex items-center"><div class="check-box mr-1">{formData.houseOwnership === 'Sharer' ? CHECK : ''}</div> Sharer</div>
            </div>
          </div>
          <div class="flex-1 border-box">
            <div class="purple-bg" style="font-size: 10px; padding: 4px; font-weight: bold; color: black;">27. SHELTER DAMAGE CLASSIFICATION</div>
            <div class="flex justify-center gap-6 py-2" style="padding-top: 6px; padding-bottom: 6px; font-size: 10px;">
              <div class="flex items-center"><div class="check-box mr-1">{formData.shelterDamage === 'Partially Damaged' ? CHECK : ''}</div> Partially Damaged</div>
              <div class="flex items-center"><div class="check-box mr-1">{formData.shelterDamage === 'Totally Damaged' ? CHECK : ''}</div> Totally Damaged</div>
            </div>
          </div>
        </div>

        </div><!-- end middle-content -->

        <!-- Signatures + Privacy -->
        <div class="bottom-section">
          <div class="signatures">
            <div class="thumbmark-box">
              <div class="thumbmark-area"></div>
              <div class="thumbmark-label">RIGHT THUMBMARK</div>
            </div>
            
            <div class="sig-lines">
              <div class="flex justify-between">
                <div class="sig-block">
                  <div class="line"></div>
                  <div class="sig-text">Signature/Thumbmark of Family Head</div>
                </div>
                <div class="sig-block">
                  <div class="line"></div>
                  <div class="sig-text">Name/Signature of Brgy. Captain</div>
                </div>
              </div>
              
              <div class="flex justify-between" style="margin-top: 28px;">
                <div class="sig-block">
                  <div class="line"></div>
                  <div class="sig-text">Date Registered</div>
                </div>
                <div class="sig-block">
                  <div class="line"></div>
                  <div class="sig-text">Name/Signature of LSWDO</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy -->
          <div class="privacy">
            <div class="privacy-title">28. DATA PRIVACY DECLARATION</div>
            <div class="privacy-text">
              All data and information indicated herein shall be used for identification purposes for the implementation of disaster risk reduction and management
              (DRRM) programs, projects and activities and its disclosure shall be in compliance to Republic Act 10173 (Data Privacy Act of 2012).
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  /* Base UI styles */
  .app-container { max-width: 1000px; margin: 0 auto; padding: 2rem; font-family: sans-serif; }
  .user-interface section { background: #f9fafb; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #e5e7eb; }
  .user-interface h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 4px; }
  .form-group label { font-size: 0.875rem; font-weight: 500; color: #374151; }
  .form-group input, .form-group select { padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; text-transform: uppercase; }
  .user-interface table input, .user-interface table select { text-transform: uppercase; }
  .user-interface table th, .user-interface table td { padding: 0.5rem; border: 1px solid #e5e7eb; }
  .btn-primary { background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: 600; border: none; cursor: pointer; }
  .btn-primary:hover { background: #1d4ed8; }

  /* Utilities */
  .flex { display: flex; }
  .flex-1 { flex: 1; }
  .items-center { align-items: center; }
  .items-end { align-items: flex-end; }
  .justify-between { justify-content: space-between; }
  .justify-center { justify-content: center; }
  .gap-2 { gap: 0.5rem; }
  .gap-4 { gap: 1rem; }
  .gap-6 { gap: 1.5rem; }
  .mr-1 { margin-right: 0.25rem; }
  .mr-2 { margin-right: 0.5rem; }
  .mr-4 { margin-right: 1rem; }
  .mr-6 { margin-right: 1.5rem; }
  .ml-4 { margin-left: 1rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1rem; }
  .mt-6 { margin-top: 1.5rem; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .pl-2 { padding-left: 0.5rem; }
  .w-full { width: 100%; }
  .h-8 { height: 2rem; }
  .whitespace-nowrap { white-space: nowrap; }
  .text-left { text-align: left; }
  .bold { font-weight: bold; }
  .border-box { border: 1px solid #1c3d70; }

  /* Print specific logic */
  @media print {
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
    body * { visibility: hidden; }
    .print-container, .print-container * { visibility: visible; }
    .print-container {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: white;
      margin: 0;
      padding: 0;
      max-width: none;
    }
    .a4-page {
      height: 100%;
      padding: 2mm;
      box-sizing: border-box;
    }
    .form-border {
      height: 100%;
    }
    .app-container { padding: 0; margin: 0; max-width: none; background: white; }
    .user-interface { display: none !important; }
    .section-title { font-weight: 900 !important; color: black !important; }
    .section-title-light { font-weight: 900 !important; color: #1c3d70 !important; }
    .purple-bg { font-weight: 900 !important; color: black !important; }
  }

  .print-container {
    font-family: Arial, Helvetica, sans-serif;
    color: black;
    font-size: 10px;
    line-height: 1.2;
    margin: 0 auto;
    width: 100%;
    max-width: 210mm;
  }
  
  .a4-page {
    width: 100%;
    padding: 2mm;
    box-sizing: border-box;
  }

  .form-border {
    border: 2px solid #1c3d70;
    padding: 3px;
    display: flex;
    flex-direction: column;
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px;
    margin-bottom: 2px;
  }

  .logo-col {
    width: 15%;
    text-align: center;
  }
  .dswd-logo {
    max-width: 50px;
    height: auto;
  }

  .title-col {
    width: 60%;
    text-align: center;
  }
  .rep { font-size: 11px; }
  .dept { font-size: 12px; font-weight: bold; margin-bottom: 2px; }
  .faced-title { font-size: 11px; font-weight: bold; color: #1c3d70; }

  .serial-col {
    width: 25%;
    text-align: right;
  }
  .not-for-sale { font-weight: bold; font-size: 10px; margin-bottom: 2px; }
  .official-use { background: #4b6382; color: white; text-align: center; font-weight: bold; font-size: 9px; padding: 2px; }
  .serial-box { border: 1px solid #1c3d70; height: 24px; position: relative; }
  .serial-label { position: absolute; top: 1px; left: 2px; font-size: 7px; }
  .serial-value { display: block; margin-top: 8px; text-align: center; font-weight: bold; font-size: 12px; }

  .section-title {
    background: #1c3d70;
    color: white;
    font-weight: 800;
    text-align: center;
    padding: 3px;
    font-size: 11px;
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .section-title-light {
    color: #1c3d70;
    font-weight: 800;
    font-size: 11px;
    margin-top: 4px;
    margin-bottom: 2px;
  }

  .grid-2-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
  }
  .pad-sm { padding: 4px 8px; }
  .border-bottom { border-bottom: 1px solid #1c3d70; padding-bottom: 8px; }

  .input-row {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
  }
  .input-row label {
    font-weight: bold;
    font-size: 10px;
    width: 130px;
    flex-shrink: 0;
  }
  .input-row.contact-row label {
    width: 120px;
  }
  .box-input {
    border: 1px solid #6b7280;
    height: 18px;
    padding: 1px 4px;
    font-size: 11px;
    box-sizing: border-box;
    overflow: hidden;
    text-transform: uppercase;
  }
  
  .sub-label {
    font-size: 8px;
    font-weight: normal;
    font-style: italic;
  }

  .contact-box {
    position: relative;
    height: 28px;
    padding-top: 10px;
  }
  .tiny-label {
    position: absolute;
    top: 1px;
    left: 2px;
    font-size: 7px;
    font-style: italic;
    color: #6b7280;
  }

  .check-box {
    width: 14px;
    height: 14px;
    border: 1px solid #1c3d70;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .address-labels {
    font-size: 8px;
    font-style: italic;
    color: #4b5563;
    padding-top: 2px;
  }
  
  .underline-line {
    border-bottom: 1px solid black;
    display: inline-block;
    min-width: 120px;
    text-align: center;
  }

  .family-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
  }
  .family-table th, .family-table td {
    border: 1px solid #1c3d70;
    text-align: center;
    font-size: 9px;
    padding: 2px;
  }
  .family-table th {
    background: #eef2f6;
    font-weight: bold;
    padding: 3px;
    font-size: 8px;
  }
  .family-table td {
    height: 18px;
    text-transform: uppercase;
  }

  .purple-bg {
    background: #6b2154;
    color: white;
    text-align: center;
    font-weight: 800;
    font-size: 9px;
    padding: 3px;
  }

  .middle-content {
    overflow: hidden;
  }

  .bottom-section {
    flex-shrink: 0;
    margin-top: 12px;
  }

  .signatures {
    display: flex;
    gap: 20px;
    padding: 0 10px;
  }
  .thumbmark-box {
    width: 80px;
  }
  .thumbmark-area {
    width: 80px;
    height: 70px;
    border: 1px solid #1c3d70;
  }
  .thumbmark-label {
    text-align: center;
    font-size: 8px;
    font-weight: bold;
    margin-top: 2px;
    border: 1px solid #1c3d70;
    border-top: none;
    padding: 2px;
  }

  .sig-lines {
    flex: 1;
    padding-top: 20px;
  }
  .sig-block {
    width: 45%;
    text-align: center;
  }
  .sig-block .line {
    border-bottom: 1px solid black;
    margin-bottom: 3px;
    height: 14px;
  }
  .sig-text {
    font-size: 9px;
  }

  .privacy {
    text-align: center;
    margin-top: 30px;
    padding: 0 20px;
    padding-bottom: 4px;
  }
  .privacy-title {
    font-weight: bold;
    font-size: 11px;
    margin-bottom: 4px;
  }
  .privacy-text {
    font-size: 9px;
    font-style: italic;
    color: #4b5563;
  }
</style>
