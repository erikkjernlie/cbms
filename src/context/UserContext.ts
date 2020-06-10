import { createContext } from "react";
import { Profile, User } from "src/types/project";

interface IContextProps {
  user: User | undefined;
  profile: Profile;
}

const UserContext = createContext({} as IContextProps);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
export default UserContext;
