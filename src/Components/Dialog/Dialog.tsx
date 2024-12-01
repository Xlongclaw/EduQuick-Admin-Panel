import React from "react";

type propTypes = {
  open: boolean;
  width: number;
  onClose: () => void;
  children: React.ReactNode;
};

const Dialog: React.FC<propTypes> = ({ open, onClose, children, width }) => {
  return (
    <div
      className={`flex  inset-0 fixed justify-center items-center transition-colors ${
        open ? "visible bg-[#0000002a]" : "invisible"
      }`}
      onClick={onClose}
    >
      <div
        style={{
          width: width,
          maxHeight: 600,
          maxWidth: 1100,
        }}
        className={`bg-[#111111] overflow-scroll shadow p-6 transition-all max-w-md
        ${open ? "scale-100 opacity-100" : "scale-110 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;