"use client";

import type { CSSProperties } from "react";
import Stepper from "@/components/stepper/Stepper";

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const inputStyle: CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
};

const sectionStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  maxWidth: 420,
};

const helperStyle: CSSProperties = {
  fontSize: 14,
  color: "#475569",
};

const PersonalInfoForm = () => {
  return (
    <div style={sectionStyle}>
      <div style={fieldStyle}>
        <label htmlFor="full-name">Full name</label>
        <input id="full-name" type="text" placeholder="Alex Johnson" style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="alex@email.com" style={inputStyle} />
      </div>
      <p style={helperStyle}>We will use this information to personalize your experience.</p>
    </div>
  );
};

const AddressForm = () => {
  return (
    <div style={sectionStyle}>
      <div style={fieldStyle}>
        <label htmlFor="street">Street address</label>
        <input id="street" type="text" placeholder="123 Main St" style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="city">City</label>
        <input id="city" type="text" placeholder="Seattle" style={inputStyle} />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="zip">Zip code</label>
        <input id="zip" type="text" placeholder="98101" style={inputStyle} />
      </div>
    </div>
  );
};

const Confirmation = () => {
  return (
    <div style={sectionStyle}>
      <h3>Review and confirm</h3>
      <p style={helperStyle}>
        Double-check your details and submit when you're ready. You can move back to edit any
        step.
      </p>
      <ul style={{ margin: 0, paddingLeft: 20, color: "#1e293b" }}>
        <li>Personal info is complete</li>
        <li>Address is ready for shipping</li>
        <li>Confirmation step complete</li>
      </ul>
    </div>
  );
};

export default function AssignmentTwoPage() {
  return (
    <main style={{ padding: "40px 24px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Assignment 2: Compound Stepper</h1>
      <p style={{ marginBottom: 24, color: "#475569" }}>
        Navigate between steps with the arrow keys, or use the buttons below.
      </p>

      <Stepper initialStep={0}>
        <Stepper.Steps>
          <Stepper.Step index={0} title="Personal Info" />
          <Stepper.Step index={1} title="Address" />
          <Stepper.Step index={2} title="Confirm" />
        </Stepper.Steps>

        <Stepper.Content>
          {(activeStep) => {
            switch (activeStep) {
              case 0:
                return <PersonalInfoForm />;
              case 1:
                return <AddressForm />;
              case 2:
                return <Confirmation />;
              default:
                return null;
            }
          }}
        </Stepper.Content>

        <Stepper.Controls>
          <Stepper.Prev />
          <Stepper.Next />
        </Stepper.Controls>
      </Stepper>
    </main>
  );
}
