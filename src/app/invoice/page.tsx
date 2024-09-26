export default function Page() {
    async function createInvoice(formData: FormData) {
        "use server";

        const rawFormData = {
            customerId: formData.get("customerId"),
            amount: formData.get("amount"),
            status: formData.get("status"),
        };

        console.log(rawFormData);
    }

    return (
        <form action={createInvoice} className="space-y-5 p-5">
            <div className="space-x-4">
                <label htmlFor="customerId">Customer ID</label>
                <input
                    type="text"
                    name="customerId"
                    id="customerId"
                    className="text-background"
                />
            </div>

            <div className="space-x-4">
                <label htmlFor="amount">Amount</label>
                <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="text-background"
                />
            </div>

            <div className="space-x-4">
                <label htmlFor="status">Status</label>
                <input
                    type="text"
                    name="status"
                    id="status"
                    className="text-background"
                />
            </div>

            <button type="submit" className="rounded-md bg-blue-700 p-1 px-3">
                Create Invoice
            </button>
        </form>
    );
}
