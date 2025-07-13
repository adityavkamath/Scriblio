import { isRedirectError } from "next/dist/client/components/redirect-error";

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

const executeAction = async <T>({
  actionFn,
  successMessage = "The actions was successful",
}: Options<T>): Promise<{
  error: string; success: boolean; message: string 
}> => {
  try {
    await actionFn();

    return {
      success: true,
      message: successMessage,
      error: "",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "An error has occurred during executing the action",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export { executeAction };
