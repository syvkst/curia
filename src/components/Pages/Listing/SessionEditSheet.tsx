import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CourtSelector } from "@/components/CourtSelector";
import { useCurrentListing } from "@/hooks/queries";
import { useMutateCurrentListing } from "@/hooks/mutations";
import { Pencil, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Listing } from "@/types/data/listing";
import { produce } from "immer";
import { DateTimePicker, TimePicker } from "@/components/ui/date-time-picker";
import { fi } from "date-fns/locale/fi";
import { sv } from "date-fns/locale/sv";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/hooks/useLanguage";

const locales = {
  fi: fi,
  sv: sv,
};

type SessionEditSheetProps = {
  getListing: () => Listing;
};

export function SessionEditSheet({ getListing }: SessionEditSheetProps) {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());
  const [currentBreak, setCurrentBreak] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
  });
  const [breakActive, setBreakActive] = useState(false);
  const [values, setValues] = useState({
    court: "",
    office: "",
    department: "",
    room: "",
  });

  const updateListing = useMutateCurrentListing();

  const { t } = useTranslation();
  const [language] = useLanguage();

  const assignListing = () => {
    const listing = getListing();

    setValues({
      ...listing,
    });

    setCurrentDate(new Date(listing.date));

    if (listing.break) {
      setCurrentBreak(listing.break);
      setBreakActive(true);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" onClick={assignListing}>
          <Pencil />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t("strings:Muokkaa tietoja")}</SheetTitle>
          <SheetDescription>
            {t(
              "strings:Tässä voit muokata tuomioistuimeen ja päivämäärään liittyviä yleisiä tietoja."
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col w-full justify-center gap-4 mt-6">
          <CourtSelector
            courtId={values.court}
            values={{ ...values }}
            onChange={(values) => {
              setValues({ ...values });
            }}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("strings:Päivämäärä")}</Label>
            <div className="col-span-3">
              <DateTimePicker
                value={currentDate}
                locale={locales[language]}
                onChange={(selected) => setCurrentDate(selected)}
                granularity="day"
                displayFormat={{ hour24: "dd.MM.yyyy" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-8 items-center gap-4">
            <Label className="text-right col-span-2">
              {t("strings:Tauko")}
            </Label>
            <div className="col-span-1">
              <Checkbox
                className="h-5 w-5"
                checked={breakActive}
                onCheckedChange={(checked) => {
                  if (checked === "indeterminate") {
                    return;
                  }

                  setBreakActive(checked);
                }}
              />
            </div>
            <div className="col-span-5">
              <TimePicker
                disabled={!breakActive}
                date={currentBreak}
                onChange={(selected) => setCurrentBreak(selected)}
                granularity="minute"
              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              className="mt-6 "
              size="lg"
              onClick={() => {
                updateListing.mutate(
                  produce(getListing(), (draft) => {
                    draft.court = values.court;
                    draft.office = values.office;
                    draft.department = values.department;
                    draft.room = values.room;
                    draft.date = currentDate;
                    draft.break = breakActive ? currentBreak : undefined;
                  })
                );
              }}
            >
              <Save className="mr-4" />
              {t("strings:Tallenna")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}