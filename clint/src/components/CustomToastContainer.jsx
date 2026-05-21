import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomToastContainer() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={
          true
        } /* Clean SaaS apps typically omit progress bars */
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
        toastClassName={() =>
          "relative flex p-4 min-h-12 rounded-xl justify-between overflow-hidden cursor-pointer bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-zinc-100 shadow-2xl shadow-black/50"
        }
        bodyClassName={() => "text-sm font-medium flex items-center p-0 m-0"}
      />

      {/* CSS injection for smooth fade-in and fade-out animations */}
      <style jsx global>{`
        @keyframes toastFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes toastFadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        /* Override React-Toastify's default animations globally */
        .Toastify__bounce-enter--top-right,
        .Toastify__slide-enter--top-right {
          animation: toastFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .Toastify__bounce-exit--top-right,
        .Toastify__slide-exit--top-right {
          animation: toastFadeOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Clean style for the close button icon color */
        .Toastify__close-button--dark {
          color: #71717a;
          opacity: 0.7;
          align-self: center;
        }
        .Toastify__close-button--dark:hover {
          color: #ffffff;
          opacity: 1;
        }
      `}</style>
    </>
  );
}
