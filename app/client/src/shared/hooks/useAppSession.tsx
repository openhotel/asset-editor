import React, { ReactNode, useContext, useEffect } from "react";
import { useCookies } from "shared/hooks/useCookies";

type AppSessionState = {};

const AppSessionContext = React.createContext<AppSessionState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AppSessionProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { get, set } = useCookies();

  const $accountId = new URLSearchParams(
    window.location.hash.replace("#", "?"),
  ).get("accountId");

  useEffect(() => {
    const accountId = $accountId ?? get("account-id");

    if (window.location.hash) {
      window.history.replaceState("", document.title, window.location.pathname);
    }

    (async () => {
      const {
        data: { enabled },
      } = await fetch("/api/auth").then((response) => response.json());

      if (!enabled) return;

      if (accountId) {
        const { status } = await fetch(
          `/api/auth/user?accountId=${accountId}`,
        ).then((response) => response.json());

        if (status === 200) return set("account-id", accountId, 1);
      }

      fetch("/api/auth/redirect")
        .then((response) => response.json())
        .then(({ data }) => (window.location.href = data.url));
    })();
  }, []);

  return <AppSessionContext.Provider value={{}} children={children} />;
};

export const useAppSession = (): AppSessionState =>
  useContext(AppSessionContext);
