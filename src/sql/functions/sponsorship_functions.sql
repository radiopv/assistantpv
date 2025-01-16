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

    -- Log the action in activity_logs
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

    -- Create audit log
    INSERT INTO children_audit_logs (
        child_id,
        action,
        changes,
        performed_by
    )
    SELECT 
        child_id,
        'sponsorship_rejected',
        jsonb_build_object(
            'request_id', request_id,
            'reason', rejection_reason
        ),
        admin_id
    FROM sponsorship_requests
    WHERE id = request_id;
END;
$$;