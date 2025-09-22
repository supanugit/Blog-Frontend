import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  // Get the token from the request cookies
  // const token = req.cookies.get("token")?.value;

  // console.log("Token in middleware:", token);

  // Redirect to login if no token and user tries to access a blog page
  // if (!token && req.nextUrl.pathname.match(/^\/blog\/[^/]+$/)) {
  //   const url = req.nextUrl.clone();
  //   url.pathname = "/login";
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
};

export const config = {
  matcher: ["/blog/:path*"], // applies to all blog pages
};
