import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY);

export async function POST(req: Request) {

  try {
    const reqData = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: reqData.email,
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }

}