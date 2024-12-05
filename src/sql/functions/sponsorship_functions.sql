-- Function to approve sponsorship request
CREATE OR REPLACE FUNCTION approve_sponsorship_request(
    request_id UUID,
    admin_id UUID
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    v_email TEXT;
    v_full_name TEXT;
    v_child_id UUID;
BEGIN
    -- Get request details
    SELECT email, full_name, child_id INTO v_email, v_full_name, v_child_id
    FROM sponsorship_requests
    WHERE id = request_id;

    -- Create sponsor account if it doesn't exist
    INSERT INTO sponsors (
        email,
        name,
        role,
        is_active
    )
    VALUES (
        v_email,
        v_full_name,
        'sponsor',
        true
    )
    ON CONFLICT (email) DO NOTHING;

    -- Create sponsorship
    INSERT INTO sponsorships (
        sponsor_id,
        child_id,
        start_date,
        status
    )
    VALUES (
        (SELECT id FROM sponsors WHERE email = v_email),
        v_child_id,
        CURRENT_DATE,
        'active'
    );

    -- Update request status
    UPDATE sponsorship_requests
    SET 
        status = 'approved',
        updated_at = NOW()
    WHERE id = request_id;

    -- Log the action
    INSERT INTO activity_logs (
        user_id,
        action,
        details
    )
    VALUES (
        admin_id,
        'approve_sponsorship_request',
        jsonb_build_object(
            'request_id', request_id,
            'sponsor_name', v_full_name,
            'child_id', v_child_id
        )
    );
END;
$$;

-- Function to reject sponsorship request
CREATE OR REPLACE FUNCTION reject_sponsorship_request(
    request_id UUID,
    admin_id UUID,
    rejection_reason TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update request status
    UPDATE sponsorship_requests
    SET 
        status = 'rejected',
        updated_at = NOW()
    WHERE id = request_id;

    -- Log the action
    INSERT INTO activity_logs (
        user_id,
        action,
        details
    )
    VALUES (
        admin_id,
        'reject_sponsorship_request',
        jsonb_build_object(
            'request_id', request_id,
            'reason', rejection_reason
        )
    );
END;
$$;