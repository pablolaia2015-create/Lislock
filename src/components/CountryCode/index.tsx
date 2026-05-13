import { Messages } from "@/lib/getMessages";

const EUROPEAN_CODES = [
  { name: "Albania", code: "355", iso: "AL" },
  { name: "Andorra", code: "376", iso: "AD" },
  { name: "Austria", code: "43", iso: "AT" },
  { name: "Azerbaijan", code: "994", iso: "AZ" },
  { name: "Belarus", code: "375", iso: "BY" },
  { name: "Belgium", code: "32", iso: "BE" },
  { name: "Bosnia and Herzegovina", code: "387", iso: "BA" },
  { name: "Bulgaria", code: "359", iso: "BG" },
  { name: "Croatia", code: "385", iso: "HR" },
  { name: "Cyprus", code: "357", iso: "CY" },
  { name: "Czech Republic", code: "420", iso: "CZ" },
  { name: "Denmark", code: "45", iso: "DK" },
  { name: "Estonia", code: "372", iso: "EE" },
  { name: "Faroe Islands", code: "298", iso: "FO" },
  { name: "Finland", code: "358", iso: "FI" },
  { name: "France", code: "33", iso: "FR" },
  { name: "Georgia", code: "995", iso: "GE" },
  { name: "Germany", code: "49", iso: "DE" },
  { name: "Gibraltar", code: "350", iso: "GI" },
  { name: "Greece", code: "30", iso: "GR" },
  { name: "Guernsey", code: "44", iso: "GG" },
  { name: "Hungary", code: "36", iso: "HU" },
  { name: "Iceland", code: "354", iso: "IS" },
  { name: "Ireland", code: "353", iso: "IE" },
  { name: "Isle of Man", code: "44", iso: "IM" },
  { name: "Italy", code: "39", iso: "IT" },
  { name: "Jersey", code: "44", iso: "JE" },
  { name: "Kosovo", code: "383", iso: "XK" },
  { name: "Latvia", code: "371", iso: "LV" },
  { name: "Liechtenstein", code: "423", iso: "LI" },
  { name: "Lithuania", code: "370", iso: "LT" },
  { name: "Luxembourg", code: "352", iso: "LU" },
  { name: "Malta", code: "356", iso: "MT" },
  { name: "Moldova", code: "373", iso: "MD" },
  { name: "Monaco", code: "377", iso: "MC" },
  { name: "Montenegro", code: "382", iso: "ME" },
  { name: "Netherlands", code: "31", iso: "NL" },
  { name: "North Macedonia", code: "389", iso: "MK" },
  { name: "Norway", code: "47", iso: "NO" },
  { name: "Poland", code: "48", iso: "PL" },
  { name: "Portugal", code: "351", iso: "PT" },
  { name: "Romania", code: "40", iso: "RO" },
  { name: "San Marino", code: "378", iso: "SM" },
  { name: "Serbia", code: "381", iso: "RS" },
  { name: "Slovakia", code: "421", iso: "SK" },
  { name: "Slovenia", code: "386", iso: "SI" },
  { name: "Spain", code: "34", iso: "ES" },
  { name: "Svalbard and Jan Mayen", code: "47", iso: "SJ" },
  { name: "Sweden", code: "46", iso: "SE" },
  { name: "Switzerland", code: "41", iso: "CH" },
  { name: "Turkey", code: "90", iso: "TR" },
  { name: "Ukraine", code: "380", iso: "UA" },
  { name: "United Kingdom", code: "44", iso: "GB" },
  { name: "Vatican City", code: "39", iso: "VA" },
];

export function CountryCodePicker({ m }: { m: Messages["bookingPage"] }) {
  const code = m.form.fields.code;
  return (
    <div className="flex flex-col gap-2">
      <select
        id="country-select"
        name="countryCode"
        className="w-[150px] rounded-l-md border border-r-0 border-slate-300 bg-white px-2 py-2 text-sm focus:outline-none"
        defaultValue={code} // Set Portugal as default since you use isPt
      >
        {EUROPEAN_CODES.map((item) => (
          <option key={item.iso} value={item.code}>
            {item.name} (+{item.code})
          </option>
        ))}
      </select>
    </div>
  );
}
