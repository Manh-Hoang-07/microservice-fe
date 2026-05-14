"use client";

import SingleSelectEnhanced from "@/components/UI/Forms/SingleSelectEnhanced";
import { adminEndpoints } from "@/lib/api/endpoints";

interface SystemLocationSelectorProps {
    value: unknown;
    onChange: (value: unknown) => void;
    formData?: Record<string, unknown>;
    onUpdate?: (key: string, value: unknown) => void;
}

export default function SystemLocationSelector({
    value: _value,
    onChange: _onChange,
    formData = {},
    onUpdate,
}: SystemLocationSelectorProps) {
    const countryId = formData?.siteCountryId as string | null | undefined;
    const provinceId = formData?.siteProvinceId as string | null | undefined;
    const wardId = formData?.siteWardId as string | null | undefined;

    const handleCountryChange = (val: string | number | null) => {
        onUpdate?.("siteCountryId", val);
        onUpdate?.("siteProvinceId", null);
        onUpdate?.("siteWardId", null);
    };

    const handleProvinceChange = (val: string | number | null) => {
        onUpdate?.("siteProvinceId", val);
        onUpdate?.("siteWardId", null);
    };

    const handleWardChange = (val: string | number | null) => {
        onUpdate?.("siteWardId", val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quốc gia</label>
                <SingleSelectEnhanced
                    value={countryId}
                    searchApi={`${adminEndpoints.location.countries.simple}?limit=1000`}
                    labelField="name"
                    valueField="id"
                    placeholder="Chọn quốc gia"
                    onChange={handleCountryChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tỉnh / Thành phố</label>
                <SingleSelectEnhanced
                    value={provinceId}
                    searchApi={
                        countryId
                            ? `${adminEndpoints.location.provinces.simple}?countryId=${countryId}&limit=1000`
                            : undefined
                    }
                    labelField="name"
                    valueField="id"
                    placeholder={countryId ? "Chọn tỉnh / thành phố" : "Vui lòng chọn quốc gia trước"}
                    disabled={!countryId}
                    onChange={handleProvinceChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phường / Xã</label>
                <SingleSelectEnhanced
                    value={wardId}
                    searchApi={
                        provinceId
                            ? `${adminEndpoints.location.wards.simple}?provinceId=${provinceId}&limit=1000`
                            : undefined
                    }
                    labelField="name"
                    valueField="id"
                    placeholder={provinceId ? "Chọn phường / xã" : "Vui lòng chọn tỉnh trước"}
                    disabled={!provinceId}
                    onChange={handleWardChange}
                />
            </div>
        </div>
    );
}
