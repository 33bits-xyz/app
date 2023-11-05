import React from "react";
import { Hourglass } from "react95";

export default function Loader() {
    return (
        <div className="d-flex align-items-center justify-content-center w-100" style={{ height: '100' }}>
            <Hourglass size={40} />
        </div>
    );
}
