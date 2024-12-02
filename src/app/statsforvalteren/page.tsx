"use client";

import CombinedData from "./combinedData";
import { AuthGuard } from "../components/AuthGuard";

const Statsforvalteren = () => {
  return (
    <AuthGuard>
      <div className="container mx-auto">
        <CombinedData />
      </div>
    </AuthGuard>
  );
};

export default Statsforvalteren;
