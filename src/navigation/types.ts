export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
};

export type AppRootStackParamList = {
  AppTabs: undefined;
  Filters: undefined;
  MatchDetail: { matchId: string };
  MatchChat: { matchId: string };
  PublicProfile: { userId: string };
  EditProfile: undefined;
  ReportUser: { userId: string };
  PostMatchRating: { matchId: string };
  RateUser: { matchId: string; userId: string };
  AdminDashboard: undefined;
  ReportDetail: { reportId: string };
};

export type AppTabParamList = {
  Home: undefined;
  Search: undefined;
  CreateMatch: undefined;
  MyMatches: undefined;
  Profile: undefined;
};
