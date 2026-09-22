// import {
//   createContext,
//   useCallback,
//   useContext,
//   useState,
//   type ReactNode,
// } from "react";

// export type FeedbackType =
//   | "success"
//   | "error"
//   | "warning"
//   | "info"
//   | "confirm";

// export type FeedbackOptions = {
//   type: FeedbackType;
//   title: string;
//   message?: string;
//   confirmText?: string;
//   cancelText?: string;
//   onConfirm?: () => void | Promise<void>;
//   onCancel?: () => void;
// };

// type FeedbackContextValue = {
//   showFeedback: (options: FeedbackOptions) => void;
//   hideFeedback: () => void;

//   success: (
//     title: string,
//     message?: string,
//   ) => void;

//   error: (
//     title: string,
//     message?: string,
//   ) => void;

//   warning: (
//     title: string,
//     message?: string,
//   ) => void;

//   info: (
//     title: string,
//     message?: string,
//   ) => void;

//   confirm: (
//     title: string,
//     message: string,
//     onConfirm: () => void | Promise<void>,
//   ) => void;
// };

// const FeedbackContext =
//   createContext<FeedbackContextValue | null>(null);

// type FeedbackProviderProps = {
//   children: ReactNode;
// };

// export function FeedbackProvider({
//   children,
// }: FeedbackProviderProps) {
//   const [feedback, setFeedback] =
//     useState<FeedbackOptions | null>(null);

//   const showFeedback = useCallback(
//     (options: FeedbackOptions) => {
//       setFeedback(options);
//     },
//     [],
//   );

//   const hideFeedback = useCallback(() => {
//     setFeedback(null);
//   }, []);

//   const success = useCallback(
//     (title: string, message?: string) => {
//       showFeedback({
//         type: "success",
//         title,
//         message,
//       });
//     },
//     [showFeedback],
//   );

//   const error = useCallback(
//     (title: string, message?: string) => {
//       showFeedback({
//         type: "error",
//         title,
//         message,
//       });
//     },
//     [showFeedback],
//   );

//   const warning = useCallback(
//     (title: string, message?: string) => {
//       showFeedback({
//         type: "warning",
//         title,
//         message,
//       });
//     },
//     [showFeedback],
//   );

//   const info = useCallback(
//     (title: string, message?: string) => {
//       showFeedback({
//         type: "info",
//         title,
//         message,
//       });
//     },
//     [showFeedback],
//   );

//   const confirm = useCallback(
//     (
//       title: string,
//       message: string,
//       onConfirm: () => void | Promise<void>,
//     ) => {
//       showFeedback({
//         type: "confirm",
//         title,
//         message,
//         confirmText: "Confirm",
//         cancelText: "Cancel",
//         onConfirm,
//       });
//     },
//     [showFeedback],
//   );

//   return (
//     <FeedbackContext.Provider
//       value={{
//         showFeedback,
//         hideFeedback,
//         success,
//         error,
//         warning,
//         info,
//         confirm,
//       }}
//     >
//       {children}

//       {/* Modal goes here */}
//     </FeedbackContext.Provider>
//   );
// }

// export function useFeedback() {
//   const context = useContext(FeedbackContext);

//   if (!context) {
//     throw new Error(
//       "useFeedback must be used within FeedbackProvider",
//     );
//   }

//   return context;
// }