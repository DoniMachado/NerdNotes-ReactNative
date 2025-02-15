import React, { createContext, useState, useContext } from "react";
import { CustomAlert, CustomDialog } from "../../Componentes";
import { LanguageContext } from "../index.js";

const GlobalComponentsContext = createContext();

const GlobalComponentsProvider = ({ children }) => {
  const timeoutDuration = 6000;
  const { getTranslation } = useContext(LanguageContext);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [dialogCancelButtonAction, setDialogCancelButtonAction] =
    useState(null);
  const [dialogConfirmButtonAction, setDialogConfirmButtonAction] =
    useState(null);

  function showAlert(
    message,
    severity = "info",
  ) {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  }

  function closeAlert() {
    setAlertMessage("");
    setAlertSeverity("info");
    setAlertOpen(false);
  }

  function showDialog(
    title,
    message,
    cancelAction = null,
    confirmAction = null
  ) {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogCancelButtonAction(cancelAction);
    setDialogConfirmButtonAction(confirmAction);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogTitle(null);
    setDialogMessage(null);
    setDialogOpen(false);
  }

  return (
    <GlobalComponentsContext.Provider
      value={{ showAlert, closeAlert, showDialog, closeDialog }}
    >
      {children}
      <CustomAlert
        alertOpen={alertOpen}
        timeoutDuration={timeoutDuration}
        alertMessage={getTranslation(alertMessage)}
        alertSeverity={alertSeverity}
        closeAlert={closeAlert}
      />
      <CustomDialog
        dialogOpen={dialogOpen}
        dialogTitle={dialogTitle}
        dialogMessage={dialogMessage}
        dialogCancelButton={getTranslation("Common::Label::Cancel")}
        dialogConfirmButton={getTranslation("Common::Label::Confirm")}
        dialogCloseAction={closeDialog}
        dialogCancelButtonAction={() => {
          if (dialogCancelButtonAction) dialogCancelButtonAction();

          closeDialog();
        }}
        dialogConfirmButtonAction={() => {
          if (dialogConfirmButtonAction) dialogConfirmButtonAction();

          closeDialog();
        }}
      />
    </GlobalComponentsContext.Provider>
  );
};

export { GlobalComponentsContext, GlobalComponentsProvider };
