import { Officer } from "@/types/data/persons";
import { produce } from "immer";
import { Col, Row } from "@/components/ui/rowcol";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Case } from "@/types/data/case";
import { OfficerSheet } from "./OfficerSheet";

type OfficerListProps = {
  officers: Officer[];
  currentCase: Case;
};

const sortOfficers = (a: Officer, b: Officer) => {
  switch (a.type) {
    case "presiding":
      return -1;
    case "secretary":
      switch (b.type) {
        case "presiding":
          return 1;
        case "secretary":
          return 0;
        default:
          return -1;
      }
    case "member":
      switch (b.type) {
        case "member":
          return 0;
        case "prosecutor":
          return -1;
        default:
          return 1;
      }
    default:
      switch (b.type) {
        case "prosecutor":
          return 0;
        default:
          return 1;
      }
  }
};

export function OfficerList({ officers, currentCase }: OfficerListProps) {
  const sortedOfficers = produce(officers, (draft) => draft.sort(sortOfficers));

  return (
    <Col className="gap-2">
      {sortedOfficers.map((officer) => (
        <OfficerItem
          key={officer.id}
          officer={officer}
          currentCase={currentCase}
        />
      ))}
    </Col>
  );
}

type OfficerItemProps = {
  officer: Officer;
  currentCase: Case;
};

export function OfficerItem({ officer, currentCase }: OfficerItemProps) {
  const { t } = useTranslation();

  return (
    <Row className="gap-3">
      <Col className="w-12 items-end">
        <Badge variant={officer.type} className="m-0 w-12 justify-center">
          {t(`positionAbbreviations:${officer.type}_abr`)}
        </Badge>
      </Col>
      <Col>
        <OfficerSheet getOfficer={() => officer} currentCase={currentCase}>
          <div className="cursor-pointer transition-all duration-200 hover:opacity-80 max-w-48 overflow-hidden text-nowrap text-ellipsis">
            {officer.name}
          </div>
        </OfficerSheet>
      </Col>
    </Row>
  );
}
