export type ContentType = {
  id?: number;
  content: string;
};

export type DateItemType = {
  workDate: string;
  isHoliday: boolean;
  details: ContentType[];
};