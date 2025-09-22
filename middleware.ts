import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token");
  // console.log(token);
  const url = req.nextUrl.clone();
  console.log(url.basePath);
  // if(url.)
  if (!token && url.pathname.match(/^\/blog\/[^/]+$/)) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/blog/:path*"], // applies to all blog pages
};
