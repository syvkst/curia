import { DropdownOption } from "@purplebureau/sy-react/dist/@types/Dropdown";
import { Case } from "./Case";
import {
  SortDirection,
  TableFilter,
} from "@purplebureau/sy-react/dist/@types/Table";

export type ListingCore = {
  id: string;
  creationDate: Date;
  date: Date;
  court: DropdownOption | null;
  office: DropdownOption | null;
  department: DropdownOption | null;
  room: DropdownOption | null;
};

export type Listing = ListingCore & {
  break?: Date;
  cases?: Case[];
};

export type ListingSummary = {
  id: string;
  creationDate: Date;
  date: Date;
  courtAbbreviation: string;
  officeName?: string;
  departmentName?: string;
  roomName?: string;
};

export type ListingQueryArgs = {
  limit: number;
  page: number;
  fileNameStart: "year" | "day";
  filters?: TableFilter[];
  sortDirection?: SortDirection;
  sortingHeader?: string;
  refresh?: boolean;
};

export type ListingResult = {
  fileCount: number;
  pageCount: number;
  limit: number;
  page: number;
  data: ListingCore[];
};
