"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/UI/Forms/FormField";
import { useSendNotification } from "@/hooks/data/admin/useAdminNotifications";

const sendNotificationSchema = z.object({
    userIdsText: z.string().min(1, "Vui lòng nhập ít nhất một User ID"),
    title: z.string().min(1, "Tiêu đề không được để trống").max(200, "Tiêu đề tối đa 200 ký tự"),
    message: z.string().min(1, "Nội dung không được để trống").max(5000, "Nội dung tối đa 5000 ký tự"),
    type: z.enum(["info", "success", "warning", "error"]).default("info"),
});

type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;

const defaultValues: SendNotificationFormValues = {
    userIdsText: "",
    title: "",
    message: "",
    type: "info",
};

const typeOptions = [
    { value: "info", label: "Thông tin (info)" },
    { value: "success", label: "Thành công (success)" },
    { value: "warning", label: "Cảnh báo (warning)" },
    { value: "error", label: "Lỗi (error)" },
];

export default function SendNotificationForm() {
    const { sendNotification, isPending } = useSendNotification();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<SendNotificationFormValues>({
        resolver: zodResolver(sendNotificationSchema),
        defaultValues,
    });

    const onSubmit = (data: SendNotificationFormValues) => {
        const userIds = data.userIdsText
            .split("\n")
            .map((id) => id.trim())
            .filter((id) => id.length > 0);

        sendNotification(
            { userIds, title: data.title, message: data.message, type: data.type },
            { onSuccess: () => reset(defaultValues) }
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* User IDs */}
                <FormField
                    label="User IDs (mỗi dòng một ID)"
                    type="textarea"
                    rows={5}
                    placeholder={"user-id-1\nuser-id-2\n..."}
                    required
                    error={errors.userIdsText?.message}
                    {...register("userIdsText")}
                />

                {/* Title */}
                <FormField
                    label="Tiêu đề"
                    type="text"
                    placeholder="Nhập tiêu đề thông báo..."
                    required
                    maxlength={200}
                    error={errors.title?.message}
                    {...register("title")}
                />

                {/* Message */}
                <FormField
                    label="Nội dung"
                    type="textarea"
                    rows={4}
                    placeholder="Nhập nội dung thông báo..."
                    required
                    maxlength={5000}
                    error={errors.message?.message}
                    {...register("message")}
                />

                {/* Type */}
                <Controller
                    name="type"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <FormField
                            label="Loại thông báo"
                            type="select"
                            value={value}
                            onChange={onChange}
                            options={typeOptions}
                            error={errors.type?.message}
                        />
                    )}
                />

                {/* Submit */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isPending && (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Gửi thông báo
                    </button>
                </div>
            </form>
        </div>
    );
}
