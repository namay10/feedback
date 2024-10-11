import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendverificationemail";
export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    0.5;
    const existinguserverified = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existinguserverified) {
      return Response.json({
        message: "username is already taken",
        success: false,
        status: 400,
      });
    }

    const existinguserbyemail = await UserModel.findOne({ email });
    const verifycode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existinguserbyemail) {
      if (existinguserbyemail.isverified) {
        return Response.json({
          message: "user with this email already exists",
          success: false,
          status: 400,
        });
      } else {
        const hashedpassword = await bcrypt.hash(password, 10);
        existinguserbyemail.password = hashedpassword;
        existinguserbyemail.verifyCode = verifycode;
        existinguserbyemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existinguserbyemail.save();
      }
    } else {
      const hashedpassword = await bcrypt.hash(password, 10);
      const expirydate = new Date();
      expirydate.setHours(expirydate.getHours() + 1);
      const newuser = new UserModel({
        username,
        email,
        password: hashedpassword,
        verifyCode: verifycode,
        verifyCodeExpiry: expirydate,
        isverified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newuser.save();
      //send verification email
      const emailresponse = await sendVerificationEmail(
        email,
        username,
        verifycode
      );
      if (!emailresponse.success) {
        return Response.json({
          message: emailresponse.message,
          success: false,
          status: 500,
        });
      }
    }
    return Response.json({
      success: true,
      message: "User created successfully",
      status: 200,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
