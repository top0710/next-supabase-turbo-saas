import 'server-only';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

import { User } from '@supabase/supabase-js';

import { z } from 'zod';

import { verifyCaptchaToken } from '@kit/auth/captcha/server';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseRouteHandlerClient } from '@kit/supabase/route-handler-client';

import { captureException, zodParseFactory } from '../utils';

interface Config<Schema> {
  auth?: boolean;
  captcha?: boolean;
  captureException?: boolean;
  schema?: Schema;
}

interface HandlerParams<
  Schema extends z.ZodType | undefined,
  RequireAuth extends boolean | undefined,
> {
  request: NextRequest;
  user: RequireAuth extends false ? undefined : User;
  body: Schema extends z.ZodType ? z.infer<Schema> : undefined;
  params: Record<string, string>;
}

/**
 * Enhanced route handler function.
 *
 * This function takes a request and parameters object as arguments and returns a route handler function.
 * The route handler function can be used to handle HTTP requests and apply additional enhancements
 * based on the provided parameters.
 *
 * Usage:
 * export const POST = enhanceRouteHandler(
 *   ({ request, body, user }) => {
 *     return new Response(`Hello, ${body.name}!`);
 *   },
 *   {
 *     schema: z.object({
 *       name: z.string(),
 *     }),
 *   },
 * );
 *
 */
export const enhanceRouteHandler = <
  Body,
  Params extends Config<z.ZodType<Body, z.ZodTypeDef>>,
>(
  // Route handler function
  handler:
    | ((
        params: HandlerParams<Params['schema'], Params['auth']>,
      ) => NextResponse | Response)
    | ((
        params: HandlerParams<Params['schema'], Params['auth']>,
      ) => Promise<NextResponse | Response>),
  // Parameters object
  params?: Params,
) => {
  /**
   * Route handler function.
   *
   * This function takes a request object as an argument and returns a response object.
   */
  return async function routeHandler(
    request: NextRequest,
    routeParams: {
      params: Record<string, string>;
    },
  ) {
    type UserParam = Params['auth'] extends false ? undefined : User;

    let user: UserParam = undefined as UserParam;

    // Check if the captcha token should be verified
    const shouldVerifyCaptcha = params?.captcha ?? false;

    // Verify the captcha token if required and setup
    if (shouldVerifyCaptcha) {
      const token = captchaTokenGetter(request);

      // If the captcha token is not provided, return a 400 response.
      if (token) {
        await verifyCaptchaToken(token);
      } else {
        return new Response('Captcha token is required', { status: 400 });
      }
    }

    const client = getSupabaseRouteHandlerClient();

    const shouldVerifyAuth = params?.auth ?? true;

    // Check if the user should be authenticated
    if (shouldVerifyAuth) {
      // Get the authenticated user
      const auth = await requireUser(client);

      // If the user is not authenticated, redirect to the specified URL.
      if (auth.error) {
        return redirect(auth.redirectTo);
      }

      user = auth.data as UserParam;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;

    if (params?.schema) {
      // clone the request to read the body
      // so that we can pass it to the handler safely
      const json = await request.clone().json();

      body = zodParseFactory(params.schema)(json);
    }

    const shouldCaptureException = params?.captureException ?? true;

    if (shouldCaptureException) {
      try {
        return await handler({
          request,
          body,
          user,
          params: routeParams.params,
        });
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }

        // capture the exception
        await captureException(error);

        throw error;
      }
    } else {
      // all good, call the handler with the request, body and user
      return handler({
        request,
        body,
        user,
        params: routeParams.params,
      });
    }
  };
};

/**
 * Get the captcha token from the request headers.
 * @param request
 */
function captchaTokenGetter(request: NextRequest) {
  return request.headers.get('x-captcha-token');
}
