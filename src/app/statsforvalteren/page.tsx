"use client";

import CombinedData from "./combinedData";
import { AuthGuard } from "../components/authGuard";

const Statsforvalteren = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto px-3">
        <CombinedData />
      </div>
    </AuthGuard>
  );
};

export default Statsforvalteren;
