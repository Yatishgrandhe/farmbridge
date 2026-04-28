"""Resource dataset generator."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Sequence

from faker import Faker
import pandas as pd


MENTAL_HEALTH_STATEWIDE = [
    ("988-crisis-line", "mental_health", "988 Suicide & Crisis Lifeline", "https://988lifeline.org", "988"),
    ("farm-aid-hotline", "farmlink", "Farm Aid Hotline", "https://www.farmaid.org/our-work/farm-advocacy/farm-aid-hotline", "1-800-327-6243"),
    ("frsan-nc", "mental_health", "FRSAN North Carolina Network", "https://www.nifa.usda.gov/grants/programs/farm-and-ranch-stress-assistance-network-frsan", "1-800-327-6243"),
    ("nc-farmlink", "farmlink", "NC FarmLink", "https://ncfarmlink.ces.ncsu.edu", "1-919-515-9563"),
    ("cfsa", "cfsa_office", "Carolina Farm Stewardship Association", "https://www.carolinafarmstewards.org", "1-919-542-2402"),
    ("agromedicine", "mental_health", "NC Agromedicine Institute", "https://www.ncagromedicine.org", "1-252-744-1008"),
    ("nc-farmworker-health", "mental_health", "NC Farmworker Health Program", "https://www.ncdhhs.gov/divisions/public-health/nc-office-rural-health/farmworker-health-program", "1-919-527-6510"),
    ("nc-hopeline", "mental_health", "NC Hope4NC Helpline", "https://www.hope4nc.com", "1-855-587-3463"),
    ("rural-advancement", "farmlink", "Rural Advancement Foundation International", "https://rafiusa.org", "1-919-542-1396"),
    ("feeding-carolinas", "food_bank", "Feeding the Carolinas", "https://www.feedingthecarolinas.org", "1-919-662-4757"),
]


@dataclass
class ResourceGenerator:
    """Generate county and statewide support resource rows."""

    faker_locale: str = "en_US"

    def _phone(self, faker: Faker) -> str:
        """Create a USDA-like office phone number."""
        return f"({faker.random_int(200, 989)}) {faker.random_int(200, 999)}-{faker.random_int(1000, 9999)}"

    def generate(self, county_rows: Sequence[dict[str, object]]) -> pd.DataFrame:
        """Generate resources with two county rows plus statewide extras.

        Args:
            county_rows: Counties to derive county_fips mapping.

        Returns:
            Resource DataFrame.
        """
        faker = Faker(self.faker_locale)
        rows: list[dict[str, object]] = []
        for county in county_rows:
            fips = str(county["fips_code"])
            name = str(county["name"])
            rows.append(
                {
                    "id": f"usda-{fips}",
                    "county_fips": fips,
                    "type": "usda_service_center",
                    "name": f"{name} USDA Service Center",
                    "address": faker.street_address() + ", NC",
                    "phone": self._phone(faker),
                    "email": f"{name.lower().replace(' ', '')}.fsa@usda.gov",
                    "website_url": "https://offices.sc.egov.usda.gov/locator/app",
                    "hours": "Mon-Fri 8:00 AM - 4:30 PM",
                    "notes": "Primary intake for FSA, NRCS, and disaster filings.",
                }
            )
            rows.append(
                {
                    "id": f"ext-{fips}",
                    "county_fips": fips,
                    "type": "extension_office",
                    "name": f"{name} County Extension Office",
                    "address": faker.street_address() + ", NC",
                    "phone": self._phone(faker),
                    "email": f"{name.lower().replace(' ', '')}@ces.ncsu.edu",
                    "website_url": "https://www.ces.ncsu.edu/local-county-center/",
                    "hours": "Mon-Fri 8:30 AM - 5:00 PM",
                    "notes": "Local support for drought planning, records prep, and applications.",
                }
            )
        for key, resource_type, title, url, phone in MENTAL_HEALTH_STATEWIDE:
            rows.append(
                {
                    "id": key,
                    "county_fips": None,
                    "type": resource_type,
                    "name": title,
                    "address": "Statewide",
                    "phone": phone,
                    "email": None,
                    "website_url": url,
                    "hours": "24/7" if key in {"988-crisis-line", "farm-aid-hotline"} else "Mon-Fri business hours",
                    "notes": "Statewide support resource.",
                }
            )
        return pd.DataFrame(rows)

    def validate(self, resources_df: pd.DataFrame) -> None:
        """Validate resource count and county office constraints."""
        if len(resources_df) < 200:
            raise ValueError("resources.csv must contain at least 200 rows.")
        grouped = resources_df.dropna(subset=["county_fips"]).groupby("county_fips")["type"].apply(set)
        invalid = grouped[grouped.apply(lambda t: "usda_service_center" not in t or "extension_office" not in t)]
        if not invalid.empty:
            raise ValueError("Each county must include one USDA center and one extension office.")

