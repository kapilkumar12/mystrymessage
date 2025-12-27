import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hello {username},</Text>
          <Text>Your verification code:</Text>
          <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
            {otp}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}