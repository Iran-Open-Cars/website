# Data model notes (based on `ecu_public.db`)

## Correct relationships

- `Car.ManufacturerID` is a real FK to `CarManufacturer.ID`.
- `CarString.CarID` is a translation table for `Car`.
- `CarManufacturerString.ManufacturerID` is a translation table for `CarManufacturer`.
- `CarEcuMapper` is the many-to-many table between `Car` and `ECU`.
- `ECU.Type` is a FK to `ECUTypes.Id`.
- `ECUTypeString.EcuTypeId` is a translation table for `ECUTypes`.
- `ECUString.ECUID` is a translation table for `ECU`.
- `CableEcuMapper` is the many-to-many table between `Cables` and `ECU`.

## Where we were making a wrong assumption

The `ECU.Manufacturer` column is **text** (`nvarchar`), not an integer FK. It should not be treated as `manufacturerId`.
In real data this field is often empty and sometimes includes plain labels like `Rayan`, so using it as an ID can lead to wrong joins and confusion.

## Practical modeling rule

- Keep car manufacturers (`CarManufacturer`) and ECU manufacturer label (`ECU.Manufacturer`) as separate concepts.
- The reliable links are mapper/FK tables (`CarEcuMapper`, `Car.ManufacturerID`, `ECU.Type`, `CableEcuMapper`).
