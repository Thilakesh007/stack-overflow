import axiosInstance from "@/lib/axiosinstance";

const Subscription = () => {
  const buyPlan = async (plan: string, amount: number) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const { data } = await axiosInstance.post("/payment/create-order", {
        amount,
        plan,
        userId: user._id,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: "INR",

        name: "CodeQuest",

        description: plan + " Plan",

        order_id: data.id,

        handler: async function (response: any) {
          await axiosInstance.post("/payment/verify", {
            ...response,
            userId: user._id,
            plan,
          });

          alert("Payment Successful");
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razor = new (window as any).Razorpay(options);

      razor.open();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-6">
        Subscription Plans
      </h1>

      <button
        onClick={() => buyPlan("Bronze",100)}
        className="bg-yellow-600 text-white p-3 rounded w-full mb-3"
      >
        Bronze ₹100
      </button>

      <button
        onClick={() => buyPlan("Silver",300)}
        className="bg-gray-600 text-white p-3 rounded w-full mb-3"
      >
        Silver ₹300
      </button>

      <button
        onClick={() => buyPlan("Gold",1000)}
        className="bg-orange-600 text-white p-3 rounded w-full"
      >
        Gold ₹1000
      </button>

    </div>
  );
};

export default Subscription;